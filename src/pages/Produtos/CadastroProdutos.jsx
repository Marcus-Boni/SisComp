import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import DataTable from 'react-data-table-component';
import toast, { Toaster } from 'react-hot-toast';

const columns = [
  { name: 'Nome do Produto', selector: (row) => row.name, sortable: true },
  { name: 'Descrição', selector: (row) => row.description, sortable: true },
  { name: 'Tipo', selector: (row) => row.type, sortable: true }
];

export const CadastroProdutos = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productType, setProductType] = useState('');
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
        type: productType
      });
      toast.success('Produto cadastrado com sucesso!');
      setProductName('');
      setProductDescription('');
      setProductType('');
    } catch (error) {
      toast.error('Erro ao cadastrar produto!');
      console.error('Erro ao cadastrar produto: ', error);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg my-12">
        <h2 className="text-2xl font-bold mb-4">Cadastro de Produto</h2>
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
            <label className="block text-gray-700">Tipo do produto</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
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
    </>
  );
};
