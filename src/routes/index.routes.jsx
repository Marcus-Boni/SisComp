import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';

import { Layout } from '../components/Layout/Layout';
import { CadastroContatos } from '../pages/Contatos';
import { CadastroCotacoes, ConsultaCotacoes } from '../pages/Cotacoes';
import { CadastroFornecedores } from '../pages/Fornecedores';
import { CadastroProdutos } from '../pages/Produtos';
import { Login } from '../pages/Login';
import { Registro } from '../pages/Registro';
import { PrivateRoute } from '../components/PrivateRoute';
import { useAuth } from '../context/AuthProvider';

export const routes = {
  login: {
    path: '/login',
    title: 'Login'
  },
  registro: {
    path: '/registro',
    title: 'Registro'
  },
  home: {
    path: '/',
    title: 'Home'
  },
  produtos: {
    path: '/produtos',
    title: 'Produtos'
  },
  fornecedores: {
    path: '/fornecedores',
    title: 'Fornecedores'
  },
  contatos: {
    path: '/contatos',
    title: 'Contatos'
  },
  cotacoes: {
    path: '/cotacoes',
    title: 'Cotações',
    children: [
      { path: '/cotacoes/consulta-cotacoes', title: 'Detalhes dos produtos' }
    ]
  },

  accessDenied: { path: '/access-denied', title: 'Acesso negado' },
  naoEncontrado: { path: '*', title: '404' }
};

// eslint-disable-next-line react-refresh/only-export-components
const ProtectedLayout = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to={routes.login.path} replace />;
  }
  return <Layout />;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={routes.login.path} element={<Login />} />
      <Route path={routes.registro.path} element={<Registro />} />

      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to={routes.home.path} replace />} />

        <Route
          path={routes.produtos.path}
          element={
            <PrivateRoute requiredRole="administrador">
              <CadastroProdutos />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.fornecedores.path}
          element={
            <PrivateRoute requiredRole="administrador">
              <CadastroFornecedores />
            </PrivateRoute>
          }
        />

        <Route
          path={routes.contatos.path}
          element={
            <PrivateRoute requiredRole="administrador">
              <CadastroContatos />
            </PrivateRoute>
          }
        />

        <Route path={routes.cotacoes.path}>
          <Route
            path="/cotacoes"
            element={
              <PrivateRoute requiredRole="administrador">
                <CadastroCotacoes />
              </PrivateRoute>
            }
          />
          <Route
            path="/cotacoes/consulta-cotacoes"
            element={<ConsultaCotacoes />}
          />
        </Route>

        <Route
          path={routes.accessDenied.path}
          element={
            <h1>Você não possui permissão para acessar este conteúdo!</h1>
          }
        />

        <Route path="*" element={<h1>404!</h1>} />
      </Route>
    </>
  )
);
