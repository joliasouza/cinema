import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CinemaProvider } from './context/CinemaContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CadastroFilmes } from './pages/CadastroFilmes';
import { CadastroSalas } from './pages/CadastroSalas';
import { CadastroSessoes } from './pages/CadastroSessoes';
import { VendaIngressos } from './pages/VendaIngressos';
import { SessoesDisponiveis } from './pages/SessoesDisponiveis';

function App() {
  return (
    <BrowserRouter>
      <CinemaProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-filmes" element={<CadastroFilmes />} />
            <Route path="/cadastro-salas" element={<CadastroSalas />} />
            <Route path="/cadastro-sessoes" element={<CadastroSessoes />} />
            <Route path="/venda-ingressos" element={<VendaIngressos />} />
            <Route path="/sessoes" element={<SessoesDisponiveis />} />
          </Routes>
        </Layout>
      </CinemaProvider>
    </BrowserRouter>
  );
}

export default App;
