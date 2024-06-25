import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import DataTable from 'react-data-table-component';

export const CadastroFornecedores = () => {
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [message, setMessage] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
      const suppliersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSuppliers(suppliersData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'suppliers'), {
        name: supplierName,
        email: supplierEmail,
        phone: supplierPhone
      });
      setMessage('Fornecedor cadastrado com sucesso!');
      setSupplierName('');
      setSupplierEmail('');
      setSupplierPhone('');
    } catch (error) {
      console.error('Erro ao cadastrar fornecedor: ', error);
      setMessage('Erro ao cadastrar fornecedor.');
    }
  };

  const columns = [
    { name: 'Nome do Fornecedor', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Telefone', selector: (row) => row.phone, sortable: true }
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Fornecedor</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nome do Fornecedor</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierEmail}
            onChange={(e) => setSupplierEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Telefone</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierPhone}
            onChange={(e) => setSupplierPhone(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Cadastrar Fornecedor
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Fornecedores Cadastrados</h2>
        <DataTable columns={columns} data={suppliers} pagination />
      </div>
    </div>
  );
};
