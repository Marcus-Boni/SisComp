import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthProvider';
import { CotacoesList } from '../../components/CotacoesList';
import toast from 'react-hot-toast';

export const RequisicaoDeCompras = () => {
  const [requisicoes, setRequisicoes] = useState([]);
  const [novaRequisicao, setNovaRequisicao] = useState('');
  const [cotacoes, setCotacoes] = useState({});
  const { currentUser, role } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'requisicoes'),
      (snapshot) => {
        const requisicoesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        requisicoesData.sort((a, b) => a.dataCriacao - b.dataCriacao);

        setRequisicoes(requisicoesData);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAddRequisicao = async () => {
    if (!novaRequisicao) {
      return toast.error('Informe a descrição da requisição.');
    }

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

    const novaCotacao = cotacoes[requisicaoId];

    if (!novaCotacao || !novaCotacao.preco || !novaCotacao.data) {
      return toast.error('Preencha os campos de preço e data.');
    }

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

    setCotacoes((prev) => ({
      ...prev,
      [requisicaoId]: { preco: '', data: '' }
    }));
  };

  const handleChangeCotacao = (requisicaoId, field, value) => {
    setCotacoes((prev) => ({
      ...prev,
      [requisicaoId]: {
        ...prev[requisicaoId],
        [field]: value
      }
    }));
  };

  const handleChangeEstado = async (id, novoEstado) => {
    const requisicaoRef = doc(db, 'requisicoes', id);
    await updateDoc(requisicaoRef, {
      estado: novoEstado
    });
  };

  const handleExportCSV = async (requisicaoId) => {
    const cotacoesCollectionRef = collection(
      db,
      'requisicoes',
      requisicaoId,
      'cotacoes'
    );
    const cotacoesSnapshot = await getDocs(cotacoesCollectionRef);

    const cotacoesData = cotacoesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      data: new Date(doc.data().data).toLocaleDateString() 
    }));

    const csvContent = [
      ['Preço', 'Data'],
      ...cotacoesData.map((c) => [c.preco, c.data])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `cotacoes_${requisicaoId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteRequisicao = async (requisicaoId) => {
    try {
      await deleteDoc(doc(db, 'requisicoes', requisicaoId));
      toast.success('Requisição excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir requisição:', error);
      toast.error('Erro ao excluir requisição.');
    }
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

              <button
                onClick={() => handleExportCSV(req.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Exportar Cotações em CSV
              </button>

              <button
                onClick={() => handleDeleteRequisicao(req.id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2 ml-2"
              >
                Excluir Requisição
              </button>

              {role === 'administrador' && req.estado !== 'cotada' && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={cotacoes[req.id]?.preco || ''}
                    onChange={(e) =>
                      handleChangeCotacao(req.id, 'preco', e.target.value)
                    }
                    className="border rounded p-2 w-1/3"
                    placeholder="Preço"
                  />
                  <input
                    type="date"
                    value={cotacoes[req.id]?.data || ''}
                    onChange={(e) =>
                      handleChangeCotacao(req.id, 'data', e.target.value)
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
