import {
  Route,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom';

import { Layout } from '../components/Layout/Layout';
import {
  CadastroContatos,
  CadastroCotacoes,
  CadastroFornecedores,
  CadastroProdutos,
  ConsultaCotacoes
} from '../pages';

export const routes = {
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
      { path: '/cotacoes/cadastro-cotacoes', title: 'Detalhes dos produtos' },
      { path: '/cotacoes/consulta-cotacoes', title: 'Detalhes dos produtos' }
    ]
  },

  accessDenied: { path: '/access-denied', title: 'Acesso negado' },
  naoEncontrado: { path: '*', title: '404' }
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={routes.home.path} element={<Layout />}>
      <Route path={routes.produtos.path}>
        <Route path="/produtos" element={<CadastroProdutos />} />
      </Route>
      <Route path={routes.fornecedores.path}>
        <Route path="/fornecedores" element={<CadastroFornecedores />} />
      </Route>
      <Route path={routes.contatos.path}>
        <Route path="/contatos" element={<CadastroContatos />} />
      </Route>
      <Route path={routes.cotacoes.path}>
        <Route path="/cotacoes" element={<CadastroCotacoes />} />
        <Route
          path="/cotacoes/consulta-cotacoes"
          element={<ConsultaCotacoes />}
        />
        <Route
          path="/cotacoes/cadastro-cotacoes"
          element={<CadastroCotacoes />}
        />
      </Route>
      <Route
        path={routes.accessDenied.path}
        element={<h1>Você não possui permissão para acessar este conteúdo!</h1>}
      />
      <Route path="*" element={<h1>404!</h1>} />
    </Route>
  )
);
