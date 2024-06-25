import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Nome do Produto', selector: (row) => row.name, sortable: true },
  { name: 'Descrição', selector: (row) => row.description, sortable: true },
  { name: 'Código', selector: (row) => row.code, sortable: true },
  { name: 'Unidade de Medida', selector: (row) => row.unit, sortable: true }
];

export const CadastroProdutos = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productUnit, setProductUnit] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: productName,
        description: productDescription,
        code: productCode,
        unit: productUnit
      });
      setMessage('Produto cadastrado com sucesso!');
      setProductName('');
      setProductDescription('');
      setProductCode('');
      setProductUnit('');
    } catch (error) {
      console.error('Erro ao cadastrar produto: ', error);
      setMessage('Erro ao cadastrar produto.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Produto</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nome do Produto</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descrição do Produto</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Código do Produto</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Unidade de Medida</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={productUnit}
            onChange={(e) => setProductUnit(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Cadastrar Produto
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Produtos Cadastrados</h2>
        <DataTable columns={columns} data={products} pagination />
      </div>
    </div>
  );
};
