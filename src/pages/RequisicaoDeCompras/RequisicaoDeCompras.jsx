import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthProvider';
import { CotacoesList } from '../../components/CotacoesList';

export const RequisicaoDeCompras = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [novaRequisicao, setNovaRequisicao] = useState('');
  const [novaCotacao, setNovaCotacao] = useState({ preco: '', data: '' });
  const { currentUser, role } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'requisicoes'),
      (snapshot) => {
        setRequisicoes(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        );
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddRequisicao = async () => {
    await addDoc(collection(db, 'requisicoes'), {
      descricao: novaRequisicao,
      estado: 'aberta',
      criadoPor: currentUser.email,
      dataCriacao: new Date()
    });
    setNovaRequisicao('');
  };

  const handleAddCotacao = async (requisicaoId) => {
    const cotacoesCollectionRef = collection(
      db,
      'requisicoes',
      requisicaoId,
      'cotacoes'
    );
    await addDoc(cotacoesCollectionRef, {
      preco: novaCotacao.preco,
      data: novaCotacao.data
    });

    const cotacoesSnapshot = await getDocs(cotacoesCollectionRef);
    const totalCotacoes = cotacoesSnapshot.size;

    if (role === 'administrador' && totalCotacoes === 1) {
      await updateDoc(doc(db, 'requisicoes', requisicaoId), {
        estado: 'em cotação'
      });
    } else if (role === 'administrador' && totalCotacoes >= 3) {
      await updateDoc(doc(db, 'requisicoes', requisicaoId), {
        estado: 'cotada'
      });
    }

    setNovaCotacao({ preco: '', data: '' });
  };

  const handleChangeEstado = async (id, novoEstado) => {
    const requisicaoRef = doc(db, 'requisicoes', id);
    await updateDoc(requisicaoRef, {
      estado: novoEstado
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Requisições de Compras</h2>
      <div className="mb-4">
        <input
          type="text"
          value={novaRequisicao}
          onChange={(e) => setNovaRequisicao(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Descreva a nova requisição"
          required
        />
        <button
          onClick={handleAddRequisicao}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Adicionar Requisição
        </button>
      </div>
      <ul className="space-y-4">
        {requisicoes.map((req) => (
          <li key={req.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{req.descricao}</span>
              <span className="font-semibold text-sm">{req.estado}</span>
              {role === 'administrador' && req.estado !== 'cotada' && (
                <button
                  onClick={() =>
                    handleChangeEstado(
                      req.id,
                      req.estado === 'aberta' ? 'em cotação' : 'cotada'
                    )
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {req.estado === 'aberta'
                    ? 'Iniciar Cotação'
                    : 'Finalizar Cotação'}
                </button>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Cotações:</h3>
              <ul className="ml-4 list-disc">
                <CotacoesList requisicaoId={req.id} />
              </ul>
              {role === 'administrador' && req.estado !== 'cotada' && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={novaCotacao.preco}
                    onChange={(e) =>
                      setNovaCotacao({
                        ...novaCotacao,
                        preco: e.target.value
                      })
                    }
                    className="border rounded p-2 w-1/3"
                    placeholder="Preço"
                  />
                  <input
                    type="date"
                    value={novaCotacao.data}
                    onChange={(e) =>
                      setNovaCotacao({ ...novaCotacao, data: e.target.value })
                    }
                    className="border rounded p-2 w-1/3 ml-2"
                  />
                  <button
                    onClick={() => handleAddCotacao(req.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Adicionar Cotação
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
