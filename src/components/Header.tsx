import { Link } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <header className="topbar">
      <nav className="nav">
        <Link to="/" className="brand">
          <i className="bi bi-camera-reels"></i> Cinema
        </Link>
        <Link to="/cadastro-filmes">
          <i className="bi bi-film"></i> Cadastro de Filmes
        </Link>
        <Link to="/cadastro-salas">
          <i className="bi bi-tv"></i> Cadastro de Salas
        </Link>
        <Link to="/cadastro-sessoes">
          <i className="bi bi-calendar-event"></i> Cadastro de Sessões
        </Link>
        <Link to="/venda-ingressos">
          <i className="bi bi-ticket-perforated"></i> Venda de Ingressos
        </Link>
        <Link to="/sessoes">
          <i className="bi bi-play-circle"></i> Sessões Disponíveis
        </Link>
      </nav>
    </header>
  );
}
