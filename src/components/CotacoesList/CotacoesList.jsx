import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';

// eslint-disable-next-line react/prop-types
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

  return (
    <>
      {cotacoes.length === 0 && <p>Nenhuma cotação por enquanto!</p>}
      {cotacoes.map((cotacao, index) => (
        <li key={index}>
          <span>Preço: R${cotacao.preco}</span> -{' '}
          <span>Data: {cotacao.data}</span>
        </li>
      ))}
    </>
  );
};
