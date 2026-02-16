
# Projeto SGB em Node.js

## Descrição

Este projeto é um sistema de Gerenciamento desenvolvido em Node.js com Express para controlar o fluxo de uma biblioteca. Ele inclui funcionalidades como CRUD de usuários e livros, controle de empréstimos, geração de relatórios e muito mais.

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
  - Controle de empréstimos, devoluções e reservas
  - Permite usuários Aluno, Professor, e Administrador
  - Administrador: Possui um email e senha única, restrigindo o acesso a usuários comuns, nesse modo, você poderá ver os usuários com empréstimos pendentes, reservas ativas e canceladas, e livros devolvidos, assim como visualizar o ranking dos livros mais emprestados e gráaficos do fluxo bibliotecário (a partir do relatório), também podera adicionar e editar livros, incluíndo os estoques
  - Usuário Aluno: Você pode logar com uma conta já existente na biblioteca, ou registrar-se com suas próprias credenciais e depois logar com a mesma conta, você pode, visualizar os livros (seja por catáloggo ou categoria) e pegar livros emprestados, tendo o limite de 3 livros simultâneos no prazo de 7 dias, e reservar quantos livros quiser, pode cancelar reservas e ter as informações dos livros que emprestou ou reservou, a data emprestada ou reservada, e o dia limite da devolução assim como os dias restantes
  - Usuário Professor: Possui um email e senha dada pela biblioteca devido aos seus privilégios, aqui, você consegue executar as mesmas funcionalidade do usuário aluno, mas terá o privilégio de emprestar até 7 livros no prazo de 15 dias.

## Estrutura do Projeto

```plaintext
src/
├── controllers/    # Lógica das rotas
├── public/         # Interface geral
├── routes/         # Definição das rotas da API
├── validators/     # Validações com Zod
├── app.js          # Configuração do servidor
└── db.js           # configuração do bando de dados
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor.
