import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCinema } from '../context/CinemaContext';
import { sessaoSchema, type SessaoFormData } from '../utils/schemas';
import type { Sessao } from '../types';
import { formatDateTime, formatCurrency } from '../utils/helpers';

export function CadastroSessoes() {
  const { filmes, salas, sessoes, addSessao, updateSessao, deleteSessao } = useCinema();
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);
  const [salaId, setSalaId] = useState<string>('');
  const [editando, setEditando] = useState<Sessao | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<SessaoFormData>({
    resolver: zodResolver(sessaoSchema) as any,
  });

  const salaIdWatch = watch('salaId');
  const salaSelected = salas.find(s => s.id === (salaIdWatch || salaId));
  const formatoDisponivel = salaSelected?.tipo || '';

  const onSubmit = async (data: SessaoFormData) => {
    try {
      setStatus(null);
      
      const sala = salas.find(s => s.id === data.salaId);
      if (!sala) {
        setStatus({ type: 'err', message: 'Sala não encontrada.' });
        return;
      }

      const formato = sala.tipo as '2D' | '3D' | 'IMAX';
      const sessaoData = { 
        ...data, 
        formato,
        preco: Number(data.preco)
      };

      if (editando) {
        await updateSessao(editando.id, sessaoData);
        setStatus({ type: 'ok', message: 'Sessão atualizada com sucesso!' });
        setEditando(null);
      } else {
        await addSessao(sessaoData);
        setStatus({ type: 'ok', message: 'Sessão salva com sucesso!' });
      }
      reset();
      setSalaId('');
    } catch (error: any) {
      console.error('Erro ao salvar sessão:', error);
      const errorMessage = error?.message || 'Erro ao salvar sessão. Verifique se a API está rodando (npm run api).';
      setStatus({ type: 'err', message: errorMessage });
    }
  };

  const handleEdit = (sessao: Sessao) => {
    setEditando(sessao);
    setSalaId(sessao.salaId);
    // Formatar datetime-local (YYYY-MM-DDTHH:mm)
    const dataFormatada = new Date(sessao.datahora).toISOString().slice(0, 16);
    
    setValue('filmeId', sessao.filmeId);
    setValue('salaId', sessao.salaId);
    setValue('datahora', dataFormatada);
    setValue('preco', sessao.preco);
    setValue('idioma', sessao.idioma);
    setValue('formato', sessao.formato);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditando(null);
    setSalaId('');
    reset();
  };

  return (
    <div>
      <h1 className="mb-3">
        <i className="bi bi-calendar-event"></i> Cadastro de Sessões
        {editando && <span className="badge bg-warning text-dark ms-2">Editando</span>}
      </h1>

      {status && (
        <div className={`alert alert-${status.type === 'ok' ? 'success' : 'danger'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleFormSubmit(onSubmit)}>
        <div className="grid">
          <div>
            <label htmlFor="filme" className="form-label">Filme</label>
            <select 
              id="filme" 
              {...register('filmeId')}
              className={`form-select ${errors.filmeId ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione</option>
              {filmes.map((filme) => (
                <option key={filme.id} value={filme.id}>{filme.titulo}</option>
              ))}
            </select>
            {errors.filmeId && (
              <div className="invalid-feedback">{errors.filmeId.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="sala" className="form-label">Sala</label>
            <select 
              id="sala" 
              {...register('salaId')}
              className={`form-select ${errors.salaId ? 'is-invalid' : ''}`}
              onChange={(e) => {
                const salaIdValue = e.target.value;
                setSalaId(salaIdValue);
                setValue('salaId', salaIdValue);
                
                // Atualizar formato quando sala for selecionada
                if (salaIdValue) {
                  const sala = salas.find(s => s.id === salaIdValue);
                  if (sala) {
                    const formato = sala.tipo as '2D' | '3D' | 'IMAX';
                    setValue('formato', formato);
                  }
                }
              }}
            >
              <option value="">Selecione</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nome} ({sala.tipo}, cap. {sala.capacidade})
                </option>
              ))}
            </select>
            {errors.salaId && (
              <div className="invalid-feedback">{errors.salaId.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="datahora" className="form-label">Data e Hora</label>
            <input 
              id="datahora" 
              type="datetime-local" 
              {...register('datahora')}
              className={`form-control ${errors.datahora ? 'is-invalid' : ''}`}
              min={new Date().toISOString().slice(0, 16)}
              max="2100-12-31T23:59"
            />
            {errors.datahora && (
              <div className="invalid-feedback">{errors.datahora.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="preco" className="form-label">Preço (R$)</label>
            <input 
              id="preco" 
              type="number" 
              min="0" 
              step="0.01" 
              {...register('preco')}
              className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
            />
            {errors.preco && (
              <div className="invalid-feedback">{errors.preco.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="idioma" className="form-label">Idioma</label>
            <select 
              id="idioma" 
              {...register('idioma')}
              className={`form-select ${errors.idioma ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione</option>
              <option value="Dublado">Dublado</option>
              <option value="Legendado">Legendado</option>
            </select>
            {errors.idioma && (
              <div className="invalid-feedback">{errors.idioma.message}</div>
            )}
          </div>

          <div>
            <label htmlFor="formato" className="form-label">Formato</label>
            <input 
              type="hidden"
              {...register('formato')}
            />
            <input 
              id="formato" 
              type="text"
              className="form-control" 
              value={salaId && salaSelected ? formatoDisponivel : 'Selecione uma sala primeiro'}
              readOnly
            />
            {salaId && salaSelected && (
              <div className="form-text">
                <i className="bi bi-info-circle"></i> Formato definido automaticamente pela sala selecionada
              </div>
            )}
            {errors.formato && (
              <div className="text-danger small mt-1">{errors.formato.message}</div>
            )}
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
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
                <i className={`bi bi-${editando ? 'check' : 'save'}`}></i> {editando ? 'Atualizar' : 'Salvar'} Sessão
              </>
            )}
          </button>
          {editando && (
            <button className="btn btn-secondary" type="button" onClick={handleCancelEdit}>
              <i className="bi bi-x"></i> Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="mb-3">Sessões cadastradas</h2>
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th>Filme</th>
            <th>Sala</th>
            <th>Data e Hora</th>
            <th>Preço</th>
            <th>Idioma</th>
            <th>Formato</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sessoes.map((sessao) => {
            const filme = filmes.find((f) => f.id === sessao.filmeId);
            const sala = salas.find((s) => s.id === sessao.salaId);
            return (
              <tr key={sessao.id}>
                <td>{filme?.titulo || '—'}</td>
                <td>{sala?.nome || '—'}</td>
                <td>{formatDateTime(sessao.datahora)}</td>
                <td>{formatCurrency(sessao.preco)}</td>
                <td><span className="badge">{sessao.idioma}</span></td>
                <td><span className="badge">{sessao.formato}</span></td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(sessao)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm(`Tem certeza que deseja excluir esta sessão?`)) {
                          try {
                            await deleteSessao(sessao.id);
                            setStatus({ type: 'ok', message: 'Sessão excluída com sucesso!' });
                          } catch (error) {
                            setStatus({ type: 'err', message: 'Erro ao excluir sessão.' });
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
