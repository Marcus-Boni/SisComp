import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { routes } from '../routes/index.routes';

export const CadastroCotacoes = () => {
  const [productId, setProductId] = useState('');
  const [quotationDate, setQuotationDate] = useState('');
  const [quotationPrice, setQuotationPrice] = useState('');
  const [message, setMessage] = useState('');
  const [quotations, setQuotations] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribeProducts();
  }, []);

  useEffect(() => {
    if (productId) {
      const q = query(
        collection(db, 'quotations'),
        where('productId', '==', productId)
      );
      const unsubscribeQuotations = onSnapshot(q, (snapshot) => {
        const quotationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuotations(quotationsData);
      });

      return () => unsubscribeQuotations();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'quotations'), {
        productId,
        date: quotationDate,
        price: parseFloat(quotationPrice)
      });
      setMessage('Cotação cadastrada com sucesso!');
      setQuotationDate('');
      setQuotationPrice('');
    } catch (error) {
      console.error('Erro ao cadastrar cotação: ', error);
      setMessage('Erro ao cadastrar cotação.');
    }
  };

  const columns = [
    {
      name: 'Data da Cotação',
      selector: (row) => format(new Date(row.date), 'dd/MM/yyyy'),
      sortable: true
    },
    { name: 'Preço', selector: (row) => row.price.toFixed(2), sortable: true }
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Cotação</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Produto</label>
          <select
            className="w-full mt-2 p-2 border rounded-lg"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Selecione um Produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Data da Cotação</label>
          <input
            type="date"
            className="w-full mt-2 p-2 border rounded-lg"
            value={quotationDate}
            onChange={(e) => setQuotationDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Preço</label>
          <input
            type="number"
            step="0.01"
            className="w-full mt-2 p-2 border rounded-lg"
            value={quotationPrice}
            onChange={(e) => setQuotationPrice(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Cadastrar Cotação
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Cotações do Produto</h2>
        <DataTable columns={columns} data={quotations} pagination />
      </div>
      <NavLink to={routes.cotacoes.children[1].path}>
        <button className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Consultar Cotações por Produto
        </button>
      </NavLink>
    </div>
  );
};
