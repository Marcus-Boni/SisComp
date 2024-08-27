import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const NaoAutorizado = () => {
  const navigate = useNavigate();

  const voltarParaHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <div className="flex items-center justify-center mb-4">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-4">
          Acesso Não Autorizado
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Você não tem permissão para acessar esta página. Se você acha que isso é um erro, por favor, entre em contato com o administrador do sistema.
        </p>
        <div className="flex justify-center">
          <button
            onClick={voltarParaHome}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
};
