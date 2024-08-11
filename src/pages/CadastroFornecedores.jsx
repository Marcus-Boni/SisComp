import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import DataTable from 'react-data-table-component';

export const CadastroFornecedores = () => {
  const [supplierName, setSupplierName] = useState('');
  const [supplierCnpj, setSupplierCnpj] = useState('');
  const [supplierSite, setSupplierSite] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
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
        cnpj: supplierCnpj,
        site: supplierSite,
        address: supplierAddress
      });
      setMessage('Fornecedor cadastrado com sucesso!');
      setSupplierName('');
      setSupplierCnpj('');
      setSupplierSite('');
      setSupplierAddress('');
    } catch (error) {
      console.error('Erro ao cadastrar fornecedor: ', error);
      setMessage('Erro ao cadastrar fornecedor.');
    }
  };

  const columns = [
    { name: 'Nome de Fantasia', selector: (row) => row.name, sortable: true },
    { name: 'Cnpj', selector: (row) => row.cnpj, sortable: true },
    { name: 'Site', selector: (row) => row.site, sortable: true },
    { name: 'Endereço', selector: (row) => row.address, sortable: true }
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg my-12">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Fornecedor</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nome de Fantasia</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Razão Social</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierCnpj}
            onChange={(e) => setSupplierCnpj(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Site</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierSite}
            onChange={(e) => setSupplierSite(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Endereço</label>
          <input
            type="text"
            className="w-full mt-2 p-2 border rounded-lg"
            value={supplierAddress}
            onChange={(e) => setSupplierAddress(e.target.value)}
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
