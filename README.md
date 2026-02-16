
# Projeto SGB em Node.js

## Descrição

Este projeto é um Sistema de Gerenciamento desenvolvido em Node.js com Express para controlar o fluxo de uma biblioteca. Ele inclui funcionalidades como CRUD de usuários e livros, controle de empréstimos e geração de relatórios.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para criação de APIs.
- **MySQL2**: Biblioteca para interação com o banco de dados MySQL.
- **Zod**: Biblioteca para validação de dados.
- **dotenv**: Gerenciamento de variáveis de ambiente.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Node.js
- MySQL
- npm ou yarn

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/BrunoFearless/Biblioteca-Digital.git
   cd seu-repositorio
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   DB_HOST=localhost
   DB_USER=seu-usuario
   DB_PASSWORD=sua-senha
   DB_DATABASE=biblioteca_api
   PORT=3000
   ```

## Uso

Inicie o servidor:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.

## Funcionalidades

  - CRUD de usuários e livros
  - Controle de empréstimos e devoluções
  - Marcar reservas a um prazo padrão
  - Logar como Aluno, Professor ou Administrador
  - Administrador: Possui um email e senha única, restringindo o acesso a usuários comuns, você pode: visualizar o fluxo dos empréstimos, devoluções, reservas (ativas, canceladas), verificar se os empréstimos estão dentro do prazo, visuaçizar os Rankings dos livros mais emprestados, e gráficos dos status recentes da biblioteca, tal como adicionar livros e editá-los
  - Usuário Aluno: Pode logar com qualquer email e senha já utilizado na biblioteca, caso não tenha, você pode criar uma conta e logar com ela, pode visualizar livros (seja o catálogo ou por categorias), buscar livros por pesquisa, pegar no máximo 3 livros empréstados no prazo de 7, e reservar quantos livros quiser, tendo a funcionalidade dele visualizar a data que reservou ou emprestou, os status, a data para a devolução, e os dias restantes
  - usuário Professor: Possui uma email e senha dado pela Biblioteca devido ao seu nível de privilégio, ele possui as mesmas funcionalidades que um usuário aluno, mas ele consegue emprestar no máximo 7 livros no prazo de 15 dias.      

## Estrutura do Projeto

```plaintext
src/
├── controllers/    # Lógica das rotas
├── public/         # interface geral
├── routes/         # Definição das rotas da API
├── validators/     # Validações com Zod
├── app.js          # Configuração do servidor
└── db.js           # configuração do bando de dados
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor.
