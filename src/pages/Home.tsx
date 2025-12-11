import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <h1><i className="bi bi-camera-reels"></i> Sistema de Gerenciamento de Cinema</h1>
      <p className="mb-4">Bem-vindo ao sistema de gerenciamento do cinema. Use o menu acima para navegar.</p>
      
      <div className="cards">
        <Link to="/cadastro-filmes" className="card">
          <h3><i className="bi bi-film"></i> Cadastro de Filmes</h3>
          <p className="small">Gerencie o catálogo de filmes disponíveis</p>
        </Link>
        
        <Link to="/cadastro-salas" className="card">
          <h3><i className="bi bi-tv"></i> Cadastro de Salas</h3>
          <p className="small">Cadastre e gerencie as salas do cinema</p>
        </Link>
        
        <Link to="/cadastro-sessoes" className="card">
          <h3><i className="bi bi-calendar-event"></i> Cadastro de Sessões</h3>
          <p className="small">Configure os horários das sessões</p>
        </Link>
        
        <Link to="/venda-ingressos" className="card">
          <h3><i className="bi bi-ticket-perforated"></i> Venda de Ingressos</h3>
          <p className="small">Realize a venda de ingressos</p>
        </Link>
        
        <Link to="/sessoes" className="card">
          <h3><i className="bi bi-play-circle"></i> Sessões Disponíveis</h3>
          <p className="small">Visualize todas as sessões em cartaz</p>
        </Link>
      </div>
    </div>
  );
}
