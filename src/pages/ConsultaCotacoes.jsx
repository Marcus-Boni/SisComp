import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';

export const ConsultaCotacoes = () => {
  const [productId, setProductId] = useState('');
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
      <h2 className="text-2xl font-bold mb-4">Consulta de Cotações</h2>
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Cotações do Produto</h2>
        <DataTable columns={columns} data={quotations} pagination />
      </div>
    </div>
  );
};
