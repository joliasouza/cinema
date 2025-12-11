export interface Filme {
  id: string;
  titulo: string;
  genero: string;
  classificacao: string;
  duracao: number;
  estreia: string;
  descricao: string;
}

export interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  tipo: '2D' | '3D' | 'IMAX';
}

export interface Sessao {
  id: string;
  filmeId: string;
  salaId: string;
  datahora: string;
  preco: number;
  idioma: 'Dublado' | 'Legendado';
  formato: '2D' | '3D';
}

export interface Ingresso {
  id: string;
  sessaoId: string;
  cliente: string;
  cpf: string;
  assento: string;
  pagamento: 'Cartão' | 'Pix' | 'Dinheiro';
  tipoIngresso: 'Inteira' | 'Meia';
  lanches?: Array<{ lancheId: string; quantidade: number }>;
}

export interface LancheCombo {
  id: string;
  nome: string;
  descricao: string;
  valorUnitario: number;
  qtUnidade: number;
  subtotal: number;
}

export const STORAGE_KEYS = {
  filmes: 'filmes',
  salas: 'salas',
  sessoes: 'sessoes',
  ingressos: 'ingressos',
  lanches: 'lanches',
} as const;
