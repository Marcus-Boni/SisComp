# Projeto de Sistema de Compras - SisComp

Bem-vindo ao sistema de gerenciamento de compras! Este projeto permite que colaboradores façam requisições de compras, acompanhem o estado das mesmas, e que administradores possam gerenciar estas requisições, bem como gerenciar colaboradores e suas permissões.

## 💼 Conta de administrador padrão para acesso ao sistema.
- **Login:** **admin@admin.com**
- **Senha:** **StrongPassword123**

## 📋 Funcionalidades

### 1. **Autenticação e Autorização**
   - **Login e Registro de Usuários:** O sistema permite que novos usuários se registrem e façam login. Há dois tipos de usuários: `Colaborador`, com acesso limitado, e `Administrador`, com acesso total.
   - **Proteção de Rotas:** Acesso às diferentes funcionalidades do sistema é controlado com base no tipo de usuário logado. Apenas administradores podem acessar determinadas áreas.

### 2. **Gerenciamento de Fornecedores**
   - **Cadastro de Fornecedores:** Administradores podem cadastrar novos fornecedores, incluindo informações como nome, CNPJ, endereço e contatos relacionados.
   - **Listagem de Fornecedores:** Exibição em tempo real dos fornecedores cadastrados no sistema, utilizando o Firebase Firestore como backend.

### 3. **Gerenciamento de Contatos**
   - **Cadastro de Contatos:** Administradores podem cadastrar pessoas de contato ligadas a cada fornecedor, permitindo associar múltiplos contatos a um único fornecedor.
   - **Listagem de Contatos:** Exibição dos contatos associados aos fornecedores cadastrados.

### 4. **Gerenciamento de Produtos**
   - **Cadastro de Produtos:** Permite o cadastro de novos produtos com detalhes como nome, categoria, e descrição.
   - **Listagem de Produtos:** Exibe uma tabela em tempo real com os produtos cadastrados.

### 5. **Gestão de Cotações**
   - **Cadastro de Cotações:** Administradores podem cadastrar cotações para os produtos, incluindo data da cotação e preço.
   - **Consulta de Cotações:** Possibilidade de consultar cotações por produto, facilitando a visualização histórica dos preços.

### 6. **Requisições de Compras**
   - **Cadastro de Requisições de Compras:** Colaboradores podem criar requisições de compras, que podem ter três estados: "aberta", "em cotação" e "cotada".
   - **Gestão de Estados de Requisições:** Administradores podem alterar o estado das requisições com base no progresso das cotações associadas.

### 7. **Dashboard do Administrador**
   - **Gestão de Usuários:** Administradores podem visualizar todos os colaboradores registrados, bloquear ou desbloquear contas, e criar novas contas de administrador.
   - **Monitoramento e Controle:** Dashboard centralizado para visualização e gestão de todas as operações do sistema.

## 🚀 Tecnologias Utilizadas

- **React.js**
- **Firebase (Firestore & Firebase Auth)**
- **Tailwind CSS**
- **Headless UI**
- **React Router**

## 📂 Estrutura do Projeto

```plaintext
src/
├── components/
│   ├── Layout/
│   ├── PrivateRoute/
│   └── ... (outros componentes)
├── pages/
│   ├── Login/
│   ├── Registro/
│   ├── Produtos/
│   ├── Fornecedores/
│   ├── Contatos/
│   ├── Cotacoes/
│   └── AdminDashboard/
├── services/
│   └── firebase.js  // Arquivo de configuração do Firebase
└── index.js
```

## ⚙️ Configuração do Firebase

Para que o projeto funcione corretamente, você precisa configurar o Firebase no projeto. Siga os passos abaixo:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Habilite o Firestore Database e o Authentication no seu projeto Firebase.
3. Crie um arquivo `firebase.js` dentro da pasta `src/services/` com o seguinte conteúdo:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🛠️ Como Rodar o Projeto

Para rodar o projeto localmente, siga as etapas abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Marcus-Boni/SisComp.git
   ```
2. Naveque até o diretório do projeto
   ```bash
   cd seu-projeto
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o projeto:
   ```bash
   npm start
   ```
5. O projeto estará disponível em http://localhost:5173.

## 🛡️ Considerações de Segurança

- Proteção de Rotas: As rotas são protegidas por meio do PrivateRoute, garantindo que apenas usuários autenticados possam acessar determinadas páginas.
- Firebase Rules: Certifique-se de configurar corretamente as regras de segurança do Firestore para proteger os dados.

## 📚 Documentação

- Para mais detalhes sobre como usar e configurar o projeto, consulte a documentação oficial do <a href="https://console.firebase.google.com/u/0/?hl=pt-br" target="_blank">Firebase</a>.

## 🤝 Contribuição

- Sinta-se à vontade para contribuir com o projeto através de pull requests ou abrindo issues.

