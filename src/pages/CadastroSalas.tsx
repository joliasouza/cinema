import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCinema } from '../context/CinemaContext';
import { salaSchema, type SalaFormData } from '../utils/schemas';
import type { Sala } from '../types';

export function CadastroSalas() {
  const { salas, addSala, updateSala, deleteSala } = useCinema();
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);
  const [editando, setEditando] = useState<Sala | null>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<SalaFormData>({
    resolver: zodResolver(salaSchema) as any,
  });

  const onSubmit = async (data: SalaFormData) => {
    try {
      setStatus(null);
      
      if (editando) {
        await updateSala(editando.id, data);
        setStatus({ type: 'ok', message: 'Sala atualizada com sucesso!' });
        setEditando(null);
      } else {
        await addSala(data);
        setStatus({ type: 'ok', message: 'Sala salva com sucesso!' });
      }
      reset();
    } catch (error) {
      setStatus({ type: 'err', message: 'Erro ao salvar sala.' });
    }
  };

  const handleEdit = (sala: Sala) => {
    setEditando(sala);
    setValue('nome', sala.nome);
    setValue('capacidade', sala.capacidade);
    setValue('tipo', sala.tipo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditando(null);
    reset();
  };

  return (
    <div>
      <h1 className="mb-3">
        <i className="bi bi-tv"></i> Cadastro de Salas
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
            <label htmlFor="nome" className="form-label">Nome da Sala</label>
            <input 
              id="nome" 
              {...register('nome')}
              className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            />
            {errors.nome && (
              <div className="invalid-feedback">{errors.nome.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="capacidade" className="form-label">Capacidade</label>
            <input 
              id="capacidade" 
              type="number" 
              min="1"
              {...register('capacidade')}
              className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
            />
            {errors.capacidade && (
              <div className="invalid-feedback">{errors.capacidade.message}</div>
            )}
          </div>
          <div>
            <label htmlFor="tipo" className="form-label">Tipo</label>
            <select 
              id="tipo" 
              {...register('tipo')}
              className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
            >
              <option value="">Selecione</option>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="IMAX">IMAX</option>
            </select>
            {errors.tipo && (
              <div className="invalid-feedback">{errors.tipo.message}</div>
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
                <i className={`bi bi-${editando ? 'check' : 'save'}`}></i> {editando ? 'Atualizar' : 'Salvar'} Sala
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

      <h2 className="mb-3">Salas cadastradas</h2>
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Capacidade</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.nome}</td>
              <td>{sala.capacidade}</td>
              <td><span className="badge">{sala.tipo}</span></td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(sala)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={async () => {
                      if (window.confirm(`Tem certeza que deseja excluir a sala "${sala.nome}"?`)) {
                        try {
                          await deleteSala(sala.id);
                          setStatus({ type: 'ok', message: 'Sala excluída com sucesso!' });
                        } catch (error) {
                          setStatus({ type: 'err', message: 'Erro ao excluir sala.' });
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
