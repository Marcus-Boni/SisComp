import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import DataTable from 'react-data-table-component';
import toast, { Toaster } from 'react-hot-toast';

export const CadastroContatos = () => {
  const [supplierId, setSupplierId] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contacts, setContacts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const unsubscribeSuppliers = onSnapshot(
      collection(db, 'suppliers'),
      (snapshot) => {
        const suppliersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setSuppliers(suppliersData);
      }
    );

    return () => unsubscribeSuppliers();
  }, []);

  useEffect(() => {
    if (supplierId) {
      const q = query(
        collection(db, 'contacts'),
        where('supplierId', '==', supplierId)
      );
      const unsubscribeContacts = onSnapshot(q, (snapshot) => {
        const contactsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setContacts(contactsData);
      });

      return () => unsubscribeContacts();
    }
  }, [supplierId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'contacts'), {
        supplierId,
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        role: contactRole
      });
      toast.success('Contato cadastrado com sucesso!');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactRole('');
    } catch (error) {
      toast.error('Erro ao cadastrar contato!');
      console.error('Erro ao cadastrar contato: ', error);
    }
  };

  const columns = [
    { name: 'Nome do Contato', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email, sortable: true },
    { name: 'Telefone', selector: (row) => row.phone, sortable: true },
    { name: 'Cargo', selector: (row) => row.role, sortable: true }
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg my-12">
        <h2 className="text-2xl font-bold mb-4">Cadastro de Contato</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Fornecedor</label>
            <select
              className="w-full mt-2 p-2 border rounded-lg"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
            >
              <option value="">Selecione um Fornecedor</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nome do Contato</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-2 border rounded-lg"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Telefone</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cargo</label>
            <input
              type="text"
              className="w-full mt-2 p-2 border rounded-lg"
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Cadastrar Contato
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Contatos Cadastrados</h2>
          <DataTable columns={columns} data={contacts} pagination />
        </div>
      </div>
    </>
  );
};
