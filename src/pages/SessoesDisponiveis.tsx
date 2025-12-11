import { Link } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import { formatDateTime, formatCurrency } from '../utils/helpers';

export function SessoesDisponiveis() {
  const { filmes, salas, sessoes, ingressos } = useCinema();

  if (sessoes.length === 0) {
    return (
      <div>
        <h1 className="mb-3"><i className="bi bi-play-circle"></i> Sessões Disponíveis</h1>
        <p className="small">Nenhuma sessão cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-3"><i className="bi bi-play-circle"></i> Sessões Disponíveis</h1>
      <div className="cards">
        {sessoes.map((s) => {
          const f = filmes.find((x) => x.id === s.filmeId);
          const sa = salas.find((x) => x.id === s.salaId);
          const vendidos = ingressos.filter((i) => i.sessaoId === s.id).length;
          
          return (
            <Link key={s.id} to={`/venda-ingressos?sessaoId=${s.id}`} className="card">
              <h3>{f?.titulo || '—'}</h3>
              <p>
                <span className="badge">{sa?.nome || '—'}</span> • {formatDateTime(s.datahora)} • {s.idioma} {s.formato}
              </p>
              <p>Preço: <strong>{formatCurrency(s.preco)}</strong></p>
              <p className="small">
                Vendidos: {vendidos}{sa ? ` / Capacidade: ${sa.capacidade}` : ''}
              </p>
              <button className="btn btn-primary" type="button">
                <i className="bi bi-cart-plus"></i> Comprar Ingresso
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
