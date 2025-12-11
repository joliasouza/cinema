# Validação com Zod e Backend com JSON Server

## 📋 Validação com Zod

### Schemas Criados (`src/utils/schemas.ts`)

Todos os formulários agora utilizam validação com **Zod**:

```typescript
// Exemplo: Schema de Filme
const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(100),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.coerce.number().min(1).max(500),
  estreia: z.string().min(1, 'Data de estreia é obrigatória'),
  descricao: z.string().min(10).max(500),
});
```

### Validações Implementadas

✅ **Filmes**
- Título: mínimo 1, máximo 100 caracteres
- Duração: 1-500 minutos
- Descrição: mínimo 10, máximo 500 caracteres

✅ **Salas**
- Nome: mínimo 1, máximo 50 caracteres
- Capacidade: 1-1000 pessoas
- Tipo: enum ['2D', '3D', 'IMAX']

✅ **Sessões**
- Preço: 0-500 reais
- Idioma: enum ['Dublado', 'Legendado']
- Formato: enum ['2D', '3D']

✅ **Ingressos**
- Cliente: mínimo 3, máximo 100 caracteres
- CPF: 11-14 caracteres com regex
- Assento: formato A10, B5, etc (regex)
- Pagamento: enum ['Cartão', 'Pix', 'Dinheiro']

### Integração com React Hook Form

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<FilmeFormData>({
  resolver: zodResolver(filmeSchema),  // Validação automática
});
```

### Mensagens de Erro

Todas as validações exibem mensagens claras:
```tsx
{errors.titulo && (
  <div className="invalid-feedback">
    {errors.titulo.message}
  </div>
)}
```

## 🌐 Backend com JSON Server

### Configuração

O JSON Server simula uma **API REST completa** com o arquivo `db.json`:

```json
{
  "filmes": [],
  "salas": [],
  "sessoes": [],
  "ingressos": []
}
```

### Como Iniciar a API

**Terminal 1 - JSON Server (porta 3000):**
```bash
npm run api
```

**Terminal 2 - Vite Dev Server (porta 5173):**
```bash
npm run dev
```

### Endpoints Disponíveis

A API REST estará em `http://localhost:3000`:

#### Filmes
- `GET /filmes` - Listar todos
- `POST /filmes` - Criar novo
- `GET /filmes/:id` - Buscar por ID
- `PUT /filmes/:id` - Atualizar
- `DELETE /filmes/:id` - Deletar

#### Salas
- `GET /salas`
- `POST /salas`
- `GET /salas/:id`
- `PUT /salas/:id`
- `DELETE /salas/:id`

#### Sessões
- `GET /sessoes`
- `POST /sessoes`
- `GET /sessoes/:id`
- `PUT /sessoes/:id`
- `DELETE /sessoes/:id`

#### Ingressos
- `GET /ingressos`
- `POST /ingressos`
- `GET /ingressos/:id`
- `PUT /ingressos/:id`
- `DELETE /ingressos/:id`

### Funcionalidades do JSON Server

✅ **IDs automáticos** - Gerados automaticamente
✅ **Persistência** - Dados salvos no `db.json`
✅ **CORS habilitado** - Funciona com o frontend
✅ **Filtros** - `?genero=Ação&classificacao=14`
✅ **Ordenação** - `?_sort=titulo&_order=asc`
✅ **Paginação** - `?_page=1&_limit=10`
✅ **Busca** - `?q=matrix`

### Camada de API (`src/utils/api.ts`)

Service para comunicação com o backend:

```typescript
export const api = {
  async getFilmes(): Promise<Filme[]> {
    const response = await fetch('http://localhost:3000/filmes');
    return response.json();
  },
  
  async createFilme(filme: Omit<Filme, 'id'>): Promise<Filme> {
    const response = await fetch('http://localhost:3000/filmes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    return response.json();
  },
};
```

### Context Atualizado

O `CinemaContext` agora:
- ✅ Usa a API ao invés do localStorage
- ✅ Carrega dados ao inicializar
- ✅ Funções assíncronas (`async/await`)
- ✅ Loading states
- ✅ Tratamento de erros

```typescript
const addFilme = async (filme: Omit<Filme, 'id'>) => {
  const novoFilme = await api.createFilme(filme);
  setFilmes([...filmes, novoFilme]);
};
```

## 🚀 Como Usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar JSON Server
```bash
npm run api
```

### 3. Em outro terminal, iniciar Vite
```bash
npm run dev
```

### 4. Acessar a aplicação
- Frontend: http://localhost:5173
- API: http://localhost:3000

## 📦 Dependências Adicionadas

```json
{
  "zod": "^4.1.13",
  "react-hook-form": "^7.68.0",
  "@hookform/resolvers": "^5.2.2",
  "json-server": "^1.0.0-beta.3"
}
```

## ✨ Benefícios

### Validação com Zod
- ✅ Type-safe
- ✅ Mensagens de erro customizadas
- ✅ Validações complexas (regex, min, max, etc)
- ✅ Reutilizável
- ✅ Auto-complete no TypeScript

### JSON Server
- ✅ API REST completa
- ✅ Sem configuração de banco
- ✅ Ideal para desenvolvimento
- ✅ Dados persistentes
- ✅ Facilita testes

## 🔄 Migração do localStorage para API

O projeto foi migrado:
- ❌ localStorage direto
- ✅ JSON Server REST API
- ✅ Fetch API com async/await
- ✅ Loading states
- ✅ Error handling
