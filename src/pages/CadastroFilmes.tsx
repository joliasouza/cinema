import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCinema } from '../context/CinemaContext';
import { filmeSchema, type FilmeFormData } from '../utils/schemas';
import { formatDate } from '../utils/helpers';
import type { Filme } from '../types';

export function CadastroFilmes() {
  const { filmes, addFilme, updateFilme, deleteFilme, loading } = useCinema();
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);
  const [editando, setEditando] = useState<Filme | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FilmeFormData>({
    resolver: zodResolver(filmeSchema) as any,
  });

  const onSubmit = async (data: FilmeFormData) => {
    try {
      setStatus(null);
      
      // Normaliza a data para evitar problema de timezone
      const dataToSave = {
        ...data,
        estreia: data.estreia.includes('T') || data.estreia.includes('Z')
          ? data.estreia
          : `${data.estreia}T12:00:00`,
      };
      
      if (editando) {
        await updateFilme(editando.id, dataToSave);
        setStatus({ type: 'ok', message: 'Filme atualizado com sucesso!' });
        setEditando(null);
      } else {
        await addFilme(dataToSave);
        setStatus({ type: 'ok', message: 'Filme salvo com sucesso!' });
      }
      reset();
    } catch (error) {
      setStatus({ type: 'err', message: 'Erro ao salvar filme. Verifique se a API está rodando (npm run api).' });
    }
  };

  const handleEdit = (filme: Filme) => {
    setEditando(filme);
    // Extrair apenas a data (YYYY-MM-DD) da string ISO
    const dataFormatada = filme.estreia.split('T')[0];
    reset({
      titulo: filme.titulo,
      genero: filme.genero,
      classificacao: filme.classificacao,
      duracao: filme.duracao,
      estreia: dataFormatada,
      descricao: filme.descricao,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditando(null);
    reset();
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-3">
        <i className="bi bi-film"></i> Cadastro de Filmes
        {editando && <span className="badge bg-warning text-dark ms-2">Editando</span>}
      </h1>
      
      {status && (
        <div className={`alert alert-${status.type === 'ok' ? 'success' : 'danger'} alert-dismissible fade show`}>
          {status.message}
          <button type="button" className="btn-close" onClick={() => setStatus(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid">
          <div>
            <label htmlFor="titulo" className="form-label">Título</label>
            <input 
              id="titulo" 
              {...register('titulo')} 
              className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
            />
            {errors.titulo && (
              <div className="invalid-feedback">{errors.titulo.message}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="genero" className="form-label">Gênero</label>
            <select 
              id="genero" 
              {...register('genero')} 
              className={`form-select ${errors.genero ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione</option>
              <option>Ação</option>
              <option>Comédia</option>
              <option>Drama</option>
              <option>Fantasia</option>
              <option>Ficção Científica</option>
              <option>Terror</option>
              <option>Animação</option>
            </select>
            {errors.genero && (
              <div className="invalid-feedback">{errors.genero.message}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="classificacao" className="form-label">Classificação Indicativa</label>
            <select 
              id="classificacao" 
              {...register('classificacao')} 
              className={`form-select ${errors.classificacao ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione</option>
              <option>Livre</option>
              <option>10</option>
              <option>12</option>
              <option>14</option>
              <option>16</option>
              <option>18</option>
            </select>
            {errors.classificacao && (
              <div className="invalid-feedback">{errors.classificacao.message}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="duracao" className="form-label">Duração (min)</label>
            <input 
              id="duracao" 
              type="number" 
              {...register('duracao')} 
              className={`form-control ${errors.duracao ? 'is-invalid' : ''}`}
            />
            {errors.duracao && (
              <div className="invalid-feedback">{errors.duracao.message}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="estreia" className="form-label">Data de Estreia</label>
            <input 
              id="estreia" 
              type="date" 
              {...register('estreia')} 
              className={`form-control ${errors.estreia ? 'is-invalid' : ''}`}
              min="1900-01-01"
              max="2099-12-31"
              onKeyDown={(e) => {
                const input = e.target as HTMLInputElement;
                const value = input.value;
                
                // Se a tecla for um número
                if (e.key >= '0' && e.key <= '9' && value && value.length >= 10) {
                  const cursorPos = input.selectionStart || 0;
                  const yearPart = value.substring(0, 4);
                  
                  // Verifica se o ano está completo (sem zeros de preenchimento automático)
                  // Um ano válido não deve começar com 0 e ter todos os dígitos diferentes de 0
                  const isYearComplete = yearPart.length === 4 && 
                                        yearPart !== '0000' && 
                                        parseInt(yearPart) >= 1000;
                  
                  // Se o cursor está na parte do ano, já tem 4 dígitos válidos, e não há seleção
                  if (cursorPos <= 4 && isYearComplete && input.selectionStart === input.selectionEnd) {
                    e.preventDefault();
                  }
                }
              }}
            />
            {errors.estreia && (
              <div className="invalid-feedback">{errors.estreia.message}</div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="descricao" className="form-label">Descrição</label>
          <textarea 
            id="descricao" 
            rows={4} 
            {...register('descricao')} 
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
          />
          {errors.descricao && (
            <div className="invalid-feedback">{errors.descricao.message}</div>
          )}
        </div>
        
        <div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <i className={`bi bi-${editando ? 'check' : 'save'}`}></i> {editando ? 'Atualizar' : 'Salvar'} Filme
                </>
              )}
            </button>
            {editando && (
              <button 
                className="btn btn-secondary" 
                type="button"
                onClick={handleCancelEdit}
              >
                <i className="bi bi-x"></i> Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <h2 className="mb-3 mt-4">Filmes cadastrados</h2>
      <div className="table-responsive">
        <table className="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>Título</th>
              <th>Gênero</th>
              <th>Classificação</th>
              <th>Duração</th>
              <th>Estreia</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filmes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  Nenhum filme cadastrado
                </td>
              </tr>
            ) : (
              filmes.map((filme) => (
                <tr key={filme.id}>
                  <td>{filme.titulo}</td>
                  <td>{filme.genero}</td>
                  <td><span className="badge bg-secondary">{filme.classificacao}</span></td>
                  <td>{filme.duracao} min</td>
                  <td>{formatDate(filme.estreia)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(filme)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          if (window.confirm(`Tem certeza que deseja excluir o filme "${filme.titulo}"?`)) {
                            try {
                              await deleteFilme(filme.id);
                              setStatus({ type: 'ok', message: 'Filme excluído com sucesso!' });
                            } catch (error) {
                              setStatus({ type: 'err', message: 'Erro ao excluir filme.' });
                            }
                          }
                        }}
                        title="Excluir"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
