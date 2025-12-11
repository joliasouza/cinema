# 🎬 Sistema de Gerenciamento de Cinema

Sistema completo para gerenciamento de cinema desenvolvido com **React**, **TypeScript** e **Vite**. Permite o cadastro de filmes, salas, sessões, venda de ingressos e lanches.

## 📋 Funcionalidades

- **Cadastro de Filmes**: Adicione, edite e exclua filmes do catálogo
- **Gerenciamento de Salas**: Configure salas com capacidade personalizada
- **Controle de Sessões**: Crie sessões associando filmes, salas, horários e preços
- **Venda de Ingressos**: 
  - Seleção de assentos disponíveis
  - Suporte para meia-entrada
  - Múltiplas formas de pagamento (Cartão, Pix, Dinheiro)
  - Validação de CPF
- **Venda de Lanches**: 
  - Combos de lanches personalizados
  - Carrinho de compras
  - Cálculo automático do total

## 🚀 Tecnologias

- [React 19.2](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Bootstrap 5.3](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/) (validação de schemas)
- [JSON Server](https://github.com/typicode/json-server) (API fake para desenvolvimento)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joliasouza/cinema.git
cd cinema
```

2. Instale as dependências:
```bash
npm install
```

## 🎮 Como Usar

O projeto utiliza dois servidores: um para a aplicação React e outro para a API fake (JSON Server).

### Opção 1: Executar ambos os servidores separadamente

**Terminal 1 - API (JSON Server):**
```bash
npm run api
```
A API estará disponível em `http://localhost:3000`

**Terminal 2 - Aplicação React:**
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173`

### Opção 2: Executar ambos simultaneamente (recomendado)

Você pode usar um gerenciador de processos como `concurrently` ou `npm-run-all`, ou abrir dois terminais conforme a Opção 1.

## 📁 Estrutura do Projeto

```
cinema/
├── src/
│   ├── components/      # Componentes reutilizáveis (Header, Layout)
│   ├── context/         # Context API (CinemaContext)
│   ├── hooks/           # Custom hooks (useLocalStorage)
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── CadastroFilmes.tsx
│   │   ├── CadastroSalas.tsx
│   │   ├── CadastroSessoes.tsx
│   │   ├── SessoesDisponiveis.tsx
│   │   ├── VendaIngressos.tsx
│   │   └── VendaLanches.tsx
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários (API, helpers, schemas)
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Entry point
├── db.json              # Banco de dados local (JSON Server)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run api` - Inicia o JSON Server (API fake)
- `npm run build` - Compila o projeto para produção
- `npm run lint` - Executa o linter
- `npm run preview` - Preview da build de produção

## 💾 Persistência de Dados

O projeto utiliza duas formas de persistência:

1. **LocalStorage**: Para dados básicos e rápidos
2. **JSON Server**: Simula uma API REST com arquivo `db.json`

## 🎨 Interface

A interface utiliza Bootstrap 5 com tema escuro, proporcionando uma experiência moderna e responsiva.

## 📝 Validações

O sistema inclui validações completas:
- CPF formatado e validado
- Verificação de capacidade das salas
- Controle de assentos ocupados
- Validação de campos obrigatórios
- Schemas Zod para validação de dados

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👤 Autor

**Jolia Souza**
- GitHub: [@joliasouza](https://github.com/joliasouza)
