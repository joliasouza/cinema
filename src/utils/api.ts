import type { Filme, Sala, Sessao, Ingresso, LancheCombo } from '../types';

const API_URL = 'http://localhost:3000';

export const api = {
  // Filmes
  async getFilmes(): Promise<Filme[]> {
    const response = await fetch(`${API_URL}/filmes`);
    if (!response.ok) throw new Error('Erro ao buscar filmes');
    return response.json();
  },
  
  async createFilme(filme: Omit<Filme, 'id'>): Promise<Filme> {
    const response = await fetch(`${API_URL}/filmes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    if (!response.ok) throw new Error('Erro ao criar filme');
    return response.json();
  },

  async deleteFilme(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/filmes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir filme');
  },

  async updateFilme(id: string, filme: Omit<Filme, 'id'>): Promise<Filme> {
    const response = await fetch(`${API_URL}/filmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...filme }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar filme');
    return response.json();
  },

  // Salas
  async getSalas(): Promise<Sala[]> {
    const response = await fetch(`${API_URL}/salas`);
    if (!response.ok) throw new Error('Erro ao buscar salas');
    return response.json();
  },
  
  async createSala(sala: Omit<Sala, 'id'>): Promise<Sala> {
    const response = await fetch(`${API_URL}/salas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sala),
    });
    if (!response.ok) throw new Error('Erro ao criar sala');
    return response.json();
  },

  async deleteSala(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/salas/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir sala');
  },

  async updateSala(id: string, sala: Omit<Sala, 'id'>): Promise<Sala> {
    const response = await fetch(`${API_URL}/salas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...sala }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar sala');
    return response.json();
  },

  // Sessões
  async getSessoes(): Promise<Sessao[]> {
    const response = await fetch(`${API_URL}/sessoes`);
    if (!response.ok) throw new Error('Erro ao buscar sessões');
    return response.json();
  },
  
  async createSessao(sessao: Omit<Sessao, 'id'>): Promise<Sessao> {
    const response = await fetch(`${API_URL}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao),
    });
    if (!response.ok) throw new Error('Erro ao criar sessão');
    return response.json();
  },

  async deleteSessao(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/sessoes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir sessão');
  },

  async updateSessao(id: string, sessao: Omit<Sessao, 'id'>): Promise<Sessao> {
    const response = await fetch(`${API_URL}/sessoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...sessao }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar sessão');
    return response.json();
  },

  // Ingressos
  async getIngressos(): Promise<Ingresso[]> {
    const response = await fetch(`${API_URL}/ingressos`);
    if (!response.ok) throw new Error('Erro ao buscar ingressos');
    return response.json();
  },
  
  async createIngresso(ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const response = await fetch(`${API_URL}/ingressos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingresso),
    });
    if (!response.ok) throw new Error('Erro ao criar ingresso');
    return response.json();
  },

  async deleteIngresso(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/ingressos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir ingresso');
  },

  async updateIngresso(id: string, ingresso: Omit<Ingresso, 'id'>): Promise<Ingresso> {
    const response = await fetch(`${API_URL}/ingressos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...ingresso }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar ingresso');
    return response.json();
  },

  // Lanches
  async getLanches(): Promise<LancheCombo[]> {
    const response = await fetch(`${API_URL}/lanches`);
    if (!response.ok) throw new Error('Erro ao buscar lanches');
    return response.json();
  },

  async createLanche(lanche: Omit<LancheCombo, 'id'>): Promise<LancheCombo> {
    const response = await fetch(`${API_URL}/lanches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lanche),
    });
    if (!response.ok) throw new Error('Erro ao criar lanche');
    return response.json();
  },

  async deleteLanche(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/lanches/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir lanche');
  },

  async updateLanche(id: string, lanche: Omit<LancheCombo, 'id'>): Promise<LancheCombo> {
    const response = await fetch(`${API_URL}/lanches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...lanche }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar lanche');
    return response.json();
  },
};
