import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';

export const CotacoesList = ({ requisicaoId }) => {
  const [cotacoes, setCotacoes] = useState([]);

  useEffect(() => {
    const cotacoesCollectionRef = collection(
      db,
      'requisicoes',
      requisicaoId,
      'cotacoes'
    );
    const unsubscribe = onSnapshot(cotacoesCollectionRef, (snapshot) => {
      setCotacoes(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsubscribe();
  }, [requisicaoId]);

  const formatDateToBR = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      {cotacoes.length === 0 && <p>Nenhuma cotação por enquanto!</p>}
      {cotacoes.map((cotacao, index) => (
        <li key={index}>
          <span>Preço: R${cotacao.preco}</span> -{' '}
          <span>
            Data:{' '}
            {cotacao.data ? formatDateToBR(cotacao.data) : 'Data inválida'}
          </span>
        </li>
      ))}
    </>
  );
};
