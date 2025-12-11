import { useState } from 'react';
import { useCinema } from '../context/CinemaContext';

interface ItemCarrinho extends LancheCombo {
  quantidade: number;
}

import type { LancheCombo } from '../types';

export function VendaLanches() {
  const { lanches } = useCinema();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);

  const adicionarAoCarrinho = (lanche: LancheCombo) => {
    const itemExistente = carrinho.find(item => item.id === lanche.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === lanche.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...lanche, quantidade: 1 }]);
    }
    
    setStatus({ type: 'ok', message: `${lanche.nome} adicionado ao carrinho!` });
    setTimeout(() => setStatus(null), 2000);
  };

  const removerDoCarrinho = (id: string) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const alterarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(id);
      return;
    }
    
    setCarrinho(carrinho.map(item => 
      item.id === id ? { ...item, quantidade } : item
    ));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.valorUnitario * item.quantidade), 0);
  };

  const finalizarPedido = () => {
    if (carrinho.length === 0) {
      setStatus({ type: 'err', message: 'Adicione itens ao carrinho antes de finalizar.' });
      return;
    }

    // Aqui você pode implementar a lógica para salvar o pedido
    setStatus({ type: 'ok', message: 'Pedido realizado com sucesso! Total: R$ ' + calcularTotal().toFixed(2) });
    setCarrinho([]);
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <h1 className="mb-3">
          <i className="bi bi-basket"></i> Lanches e Combos
        </h1>

        {status && (
          <div className={`alert alert-${status.type === 'ok' ? 'success' : 'danger'} alert-dismissible fade show`}>
            {status.message}
            <button type="button" className="btn-close" onClick={() => setStatus(null)}></button>
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {lanches.map((lanche) => (
            <div key={lanche.id} className="col">
              <div className="card h-100 bg-dark border-secondary">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <i className="bi bi-cup-straw"></i> {lanche.nome}
                  </h5>
                  <p className="card-text text-muted small">{lanche.descricao}</p>
                  <div className="mt-auto">
                    <p className="h4 text-success mb-3">
                      R$ {lanche.valorUnitario.toFixed(2)}
                    </p>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => adicionarAoCarrinho(lanche)}
                    >
                      <i className="bi bi-cart-plus"></i> Adicionar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lanches.length === 0 && (
          <div className="alert alert-info">
            <i className="bi bi-info-circle"></i> Nenhum lanche cadastrado ainda.
          </div>
        )}
      </div>

      <div className="col-lg-4">
        <div className="card bg-dark border-secondary sticky-top" style={{ top: '1rem' }}>
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-cart"></i> Carrinho
              {carrinho.length > 0 && (
                <span className="badge bg-primary ms-2">{carrinho.length}</span>
              )}
            </h5>
          </div>
          <div className="card-body">
            {carrinho.length === 0 ? (
              <p className="text-muted text-center py-4">
                <i className="bi bi-cart-x" style={{ fontSize: '3rem' }}></i>
                <br />
                Carrinho vazio
              </p>
            ) : (
              <>
                <div className="list-group list-group-flush mb-3">
                  {carrinho.map((item) => (
                    <div key={item.id} className="list-group-item bg-dark border-secondary p-2">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.nome}</h6>
                          <small className="text-success">
                            R$ {item.valorUnitario.toFixed(2)} x {item.quantidade}
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removerDoCarrinho(item.id)}
                          title="Remover"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          style={{ width: '60px' }}
                          value={item.quantidade}
                          onChange={(e) => alterarQuantidade(item.id, parseInt(e.target.value) || 0)}
                          min="0"
                        />
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                        <div className="ms-auto fw-bold">
                          R$ {(item.valorUnitario * item.quantidade).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top border-secondary pt-3">
                  <div className="d-flex justify-content-between mb-3">
                    <h5>Total:</h5>
                    <h5 className="text-success">R$ {calcularTotal().toFixed(2)}</h5>
                  </div>
                  <button 
                    className="btn btn-success w-100"
                    onClick={finalizarPedido}
                  >
                    <i className="bi bi-check-circle"></i> Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
