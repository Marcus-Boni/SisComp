import { useState, useEffect } from 'react';
import { db, auth } from '../../services/firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [novoAdminEmail, setNovoAdminEmail] = useState('');
  const [novoAdminSenha, setNovoAdminSenha] = useState('');

  useEffect(() => {
    const fetchData = () => {
      const usersCollectionRef = collection(db, 'users');

      const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
        const userList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((user) => user.exists);

        const activeUsers = userList.filter((user) => user.exists);

        setColaboradores(activeUsers);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!novoAdminEmail || !novoAdminSenha) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        novoAdminEmail,
        novoAdminSenha
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        email: novoAdminEmail,
        role: 'administrador',
        blocked: false,
        active: true
      });

      toast.success('Novo administrador criado com sucesso!');
      setNovoAdminEmail('');
      setNovoAdminSenha('');
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email já está em uso.');
      } else {
        toast.error('Erro ao criar administrador. Tente novamente.');
      }
    }
  };

  const handleToggleBlockUser = async (userId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        blocked: !currentStatus,
        active: !currentStatus ? true : false
      });
      toast.success(
        `Usuário ${!currentStatus ? 'bloqueado' : 'desbloqueado'} com sucesso!`
      );
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      toast.error('Não foi possível atualizar o status do usuário.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Dashboard do Administrador
      </h2>

      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Criar Novo Administrador
        </h3>
        <form onSubmit={handleCreateAdmin}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={novoAdminEmail}
              onChange={(e) => setNovoAdminEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Senha</label>
            <input
              type="password"
              value={novoAdminSenha}
              onChange={(e) => setNovoAdminSenha(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Criar Administrador
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Lista de Colaboradores
        </h3>
        {colaboradores.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum colaborador encontrado.
          </p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">
                  Email
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">
                  Status
                </th>
                <th className="py-2 px-4 border-b border-gray-200 text-center text-gray-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {colaboradores
                .filter((user) => user.role === 'colaborador')
                .map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {user.blocked ? (
                        <span className="text-red-500 font-semibold">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="text-green-500 font-semibold">
                          Ativo
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200 text-center">
                      <button
                        onClick={() =>
                          handleToggleBlockUser(user.id, user.blocked)
                        }
                        className={`py-2 px-4 rounded ${
                          user.blocked
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        } text-white transition duration-300`}
                      >
                        {user.blocked ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
