import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Filme, Sala, Sessao, Ingresso, LancheCombo } from '../types';
import { api } from '../utils/api';

interface CinemaContextType {
  filmes: Filme[];
  salas: Sala[];
  sessoes: Sessao[];
  ingressos: Ingresso[];
  lanches: LancheCombo[];
  loading: boolean;
  addFilme: (filme: Omit<Filme, 'id'>) => Promise<void>;
  addSala: (sala: Omit<Sala, 'id'>) => Promise<void>;
  addSessao: (sessao: Omit<Sessao, 'id'>) => Promise<void>;
  addIngresso: (ingresso: Omit<Ingresso, 'id'>) => Promise<void>;
  updateFilme: (id: string, filme: Omit<Filme, 'id'>) => Promise<void>;
  updateSala: (id: string, sala: Omit<Sala, 'id'>) => Promise<void>;
  updateSessao: (id: string, sessao: Omit<Sessao, 'id'>) => Promise<void>;
  updateIngresso: (id: string, ingresso: Omit<Ingresso, 'id'>) => Promise<void>;
  deleteFilme: (id: string) => Promise<void>;
  deleteSala: (id: string) => Promise<void>;
  deleteSessao: (id: string) => Promise<void>;
  deleteIngresso: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

export function CinemaProvider({ children }: { children: ReactNode }) {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [filmesData, salasData, sessoesData, ingressosData, lanchesData] = await Promise.all([
        api.getFilmes(),
        api.getSalas(),
        api.getSessoes(),
        api.getIngressos(),
        api.getLanches(),
      ]);
      setFilmes(filmesData);
      setSalas(salasData);
      setSessoes(sessoesData);
      setIngressos(ingressosData);
      setLanches(lanchesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addFilme = async (filme: Omit<Filme, 'id'>) => {
    const novoFilme = await api.createFilme(filme);
    setFilmes([...filmes, novoFilme]);
  };

  const addSala = async (sala: Omit<Sala, 'id'>) => {
    const novaSala = await api.createSala(sala);
    setSalas([...salas, novaSala]);
  };

  const addSessao = async (sessao: Omit<Sessao, 'id'>) => {
    const novaSessao = await api.createSessao(sessao);
    setSessoes([...sessoes, novaSessao]);
  };

  const addIngresso = async (ingresso: Omit<Ingresso, 'id'>) => {
    const novoIngresso = await api.createIngresso(ingresso);
    setIngressos([...ingressos, novoIngresso]);
  };

  const deleteFilme = async (id: string) => {
    await api.deleteFilme(id);
    setFilmes(filmes.filter(f => f.id !== id));
  };

  const deleteSala = async (id: string) => {
    await api.deleteSala(id);
    setSalas(salas.filter(s => s.id !== id));
  };

  const deleteSessao = async (id: string) => {
    await api.deleteSessao(id);
    setSessoes(sessoes.filter(s => s.id !== id));
  };

  const deleteIngresso = async (id: string) => {
    await api.deleteIngresso(id);
    setIngressos(ingressos.filter(i => i.id !== id));
  };

  const updateFilme = async (id: string, filme: Omit<Filme, 'id'>) => {
    const filmeAtualizado = await api.updateFilme(id, filme);
    setFilmes(filmes.map(f => f.id === id ? filmeAtualizado : f));
  };

  const updateSala = async (id: string, sala: Omit<Sala, 'id'>) => {
    const salaAtualizada = await api.updateSala(id, sala);
    setSalas(salas.map(s => s.id === id ? salaAtualizada : s));
  };

  const updateSessao = async (id: string, sessao: Omit<Sessao, 'id'>) => {
    const sessaoAtualizada = await api.updateSessao(id, sessao);
    setSessoes(sessoes.map(s => s.id === id ? sessaoAtualizada : s));
  };

  const updateIngresso = async (id: string, ingresso: Omit<Ingresso, 'id'>) => {
    const ingressoAtualizado = await api.updateIngresso(id, ingresso);
    setIngressos(ingressos.map(i => i.id === id ? ingressoAtualizado : i));
  };

  return (
    <CinemaContext.Provider
      value={{
        filmes,
        salas,
        sessoes,
        ingressos,
        lanches,
        loading,
        addFilme,
        addSala,
        addSessao,
        addIngresso,
        updateFilme,
        updateSala,
        updateSessao,
        updateIngresso,
        deleteFilme,
        deleteSala,
        deleteSessao,
        deleteIngresso,
        refreshData,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
}

export function useCinema() {
  const context = useContext(CinemaContext);
  if (context === undefined) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
}
