import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCinema } from '../context/CinemaContext';
import type { Ingresso, LancheCombo } from '../types';

interface ItemCarrinho {
  lanche: LancheCombo;
  quantidade: number;
}

export function VendaIngressos() {
  const { filmes, salas, sessoes, ingressos, lanches, addIngresso, updateIngresso, deleteIngresso } = useCinema();
  const [status, setStatus] = useState<{ type: 'ok' | 'err'; message: string } | null>(null);
  const [sessaoInfo, setSessaoInfo] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [sessaoId, setSessaoId] = useState<string>('');
  const [assentoSelecionado, setAssentoSelecionado] = useState<string>('');
  const [tipoIngresso, setTipoIngresso] = useState<'Inteira' | 'Meia'>('Inteira');
  const [editando, setEditando] = useState<Ingresso | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [searchParams] = useSearchParams();

  // Gerar assentos baseado na capacidade da sala
  const generateAssentos = (capacidade: number) => {
    const assentos: string[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = Math.ceil(capacidade / rows.length);
    
    for (let i = 0; i < rows.length && assentos.length < capacidade; i++) {
      for (let j = 1; j <= seatsPerRow && assentos.length < capacidade; j++) {
        assentos.push(`${rows[i]}${j}`);
      }
    }
    return assentos;
  };

  const sessaoSelecionada = sessoes.find(s => s.id === sessaoId);
  const salaSelecionada = sessaoSelecionada ? salas.find(sa => sa.id === sessaoSelecionada.salaId) : null;
  const assentosOcupados = ingressos
    .filter(i => i.sessaoId === sessaoId && (!editando || i.id !== editando.id))
    .map(i => i.assento);
  const assentosDisponiveis = salaSelecionada ? generateAssentos(salaSelecionada.capacidade) : [];
  
  // Calcular preço baseado no tipo de ingresso
  const precoCalculado = sessaoSelecionada 
    ? tipoIngresso === 'Meia' 
      ? sessaoSelecionada.preco / 2 
      : sessaoSelecionada.preco
    : 0;

  // Calcular total de lanches
  const totalLanches = carrinho.reduce((total, item) => total + (item.lanche.valorUnitario * item.quantidade), 0);
  const totalGeral = precoCalculado + totalLanches;

  const adicionarLanche = (lanche: LancheCombo) => {
    const itemExistente = carrinho.find(item => item.lanche.id === lanche.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.lanche.id === lanche.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { lanche, quantidade: 1 }]);
    }
  };

  const removerLanche = (id: string) => {
    setCarrinho(carrinho.filter(item => item.lanche.id !== id));
  };

  const alterarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerLanche(id);
      return;
    }
    
    setCarrinho(carrinho.map(item => 
      item.lanche.id === id ? { ...item, quantidade } : item
    ));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return numbers.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleAssentoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setAssentoSelecionado(value);
  };

  const validateAssento = (assento: string): boolean => {
    if (!salaSelecionada) return false;
    const assentosValidos = generateAssentos(salaSelecionada.capacidade);
    return assentosValidos.includes(assento.toUpperCase());
  };

  const updateSessaoInfo = (sessaoIdParam: string) => {
    setSessaoId(sessaoIdParam);
    setAssentoSelecionado('');
    
    if (!sessaoIdParam) {
      setSessaoInfo('');
      return;
    }

    const sessao = sessoes.find((s) => s.id === sessaoIdParam);
    const sala = sessao ? salas.find((sa) => sa.id === sessao.salaId) : null;
    const vendidos = ingressos.filter((i) => i.sessaoId === sessaoIdParam).length;
    const texto = sessao && sala 
      ? `Capacidade: ${sala.capacidade} | Vendidos: ${vendidos} | Restantes: ${Math.max(0, sala.capacidade - vendidos)}`
      : '';
    setSessaoInfo(texto);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const sessaoIdFromForm = formData.get('sessao') as string;
    const cliente = formData.get('cliente') as string;
    const cpfValue = cpf.replace(/\D/g, ''); // Remove formatação para salvar apenas números
    const assento = assentoSelecionado;
    const pagamento = formData.get('pagamento') as Ingresso['pagamento'];
    const tipoIngressoValue = tipoIngresso;

    if (!sessaoIdFromForm || !cliente || !cpfValue || !assento || !pagamento) {
      setStatus({ type: 'err', message: 'Preencha todos os campos e selecione um assento.' });
      return;
    }

    // Validar formato e validade do assento
    if (!validateAssento(assento)) {
      setStatus({ type: 'err', message: 'Assento inválido. Use o formato correto (ex: A1, B5, etc).' });
      return;
    }

    // Validar capacidade
    const sessao = sessoes.find((s) => s.id === sessaoIdFromForm);
    const sala = sessao ? salas.find((s) => s.id === sessao.salaId) : null;
    const vendidos = ingressos.filter((i) => i.sessaoId === sessaoIdFromForm && (!editando || i.id !== editando.id));

    if (sala && vendidos.length >= sala.capacidade) {
      setStatus({ type: 'err', message: 'Capacidade esgotada para esta sessão.' });
      return;
    }

    // Validar assento duplicado
    const assentoOcupado = vendidos.some((i) => i.assento === assento);
    if (assentoOcupado) {
      setStatus({ type: 'err', message: 'Assento já vendido para esta sessão.' });
      return;
    }

    try {
      // Converter carrinho para o formato de lanches do ingresso
      const lanchesIngresso = carrinho.length > 0 
        ? carrinho.map(item => ({ lancheId: item.lanche.id, quantidade: item.quantidade }))
        : undefined;

      if (editando) {
        await updateIngresso(editando.id, { 
          sessaoId: sessaoIdFromForm, 
          cliente, 
          cpf: cpfValue, 
          assento, 
          pagamento, 
          tipoIngresso: tipoIngressoValue,
          lanches: lanchesIngresso
        });
        const mensagemLanches = carrinho.length > 0 ? ` + ${carrinho.length} lanche(s)` : '';
        setStatus({ type: 'ok', message: `Ingresso atualizado! Total: R$ ${totalGeral.toFixed(2)}${mensagemLanches}` });
        setEditando(null);
      } else {
        await addIngresso({ 
          sessaoId: sessaoIdFromForm, 
          cliente, 
          cpf: cpfValue, 
          assento, 
          pagamento, 
          tipoIngresso: tipoIngressoValue,
          lanches: lanchesIngresso
        });
        const mensagemLanches = carrinho.length > 0 ? ` + ${carrinho.length} lanche(s)` : '';
        setStatus({ type: 'ok', message: `Venda confirmada! Total: R$ ${totalGeral.toFixed(2)}${mensagemLanches}` });
      }
      form.reset();
      setCpf('');
      setAssentoSelecionado('');
      setTipoIngresso('Inteira');
      setCarrinho([]);
      updateSessaoInfo(sessaoIdFromForm);
    } catch (error) {
      setStatus({ type: 'err', message: 'Erro ao salvar ingresso.' });
    }
  };

  const handleEdit = (ingresso: Ingresso) => {
    setEditando(ingresso);
    setSessaoId(ingresso.sessaoId);
    setCpf(formatCPF(ingresso.cpf));
    setTipoIngresso(ingresso.tipoIngresso);
    
    // Recuperar lanches do ingresso
    if (ingresso.lanches && ingresso.lanches.length > 0) {
      const carrinhoRecuperado: ItemCarrinho[] = ingresso.lanches
        .map(lancheItem => {
          const lanche = lanches.find(l => l.id === lancheItem.lancheId);
          return lanche ? { lanche, quantidade: lancheItem.quantidade } : null;
        })
        .filter((item): item is ItemCarrinho => item !== null);
      setCarrinho(carrinhoRecuperado);
    } else {
      setCarrinho([]);
    }
    
    // Atualizar info da sessão sem limpar o assento
    const sessao = sessoes.find((s) => s.id === ingresso.sessaoId);
    const sala = sessao ? salas.find((sa) => sa.id === sessao.salaId) : null;
    const vendidos = ingressos.filter((i) => i.sessaoId === ingresso.sessaoId).length;
    const texto = sessao && sala 
      ? `Capacidade: ${sala.capacidade} | Vendidos: ${vendidos} | Restantes: ${Math.max(0, sala.capacidade - vendidos)}`
      : '';
    setSessaoInfo(texto);
    
    // Definir o assento DEPOIS de atualizar a sessão
    setAssentoSelecionado(ingresso.assento);
    
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('sessao') as HTMLSelectElement).value = ingresso.sessaoId;
      (form.elements.namedItem('cliente') as HTMLInputElement).value = ingresso.cliente;
      (form.elements.namedItem('pagamento') as HTMLSelectElement).value = ingresso.pagamento;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditando(null);
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) form.reset();
    setCpf('');
    setAssentoSelecionado('');
    setTipoIngresso('Inteira');
    setCarrinho([]);
    setSessaoId('');
  };

  // Pré-selecionar sessão via URL
  useEffect(() => {
    const sessaoIdParam = searchParams.get('sessaoId');
    if (sessaoIdParam) {
      const select = document.getElementById('sessao') as HTMLSelectElement;
      if (select) {
        select.value = sessaoIdParam;
        updateSessaoInfo(sessaoIdParam);
      }
    }
  }, [searchParams, sessoes, salas, ingressos]);

  return (
    <div>
      <div>
        <h1 className="mb-3">
          <i className="bi bi-ticket-perforated"></i> Venda de Ingressos
          {editando && <span className="badge bg-warning text-dark ms-2">Editando</span>}
        </h1>
        
        {status && (
          <div className={`alert alert-${status.type === 'ok' ? 'success' : 'danger'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <label htmlFor="sessao" className="form-label">Sessão</label>
              <select 
                id="sessao" 
                name="sessao" 
                className="form-select"
                required
                value={sessaoId}
                onChange={(e) => updateSessaoInfo(e.target.value)}
              >
                <option value="">Selecione</option>
                {sessoes.map((s) => {
                  const f = filmes.find((x) => x.id === s.filmeId);
                  const sa = salas.find((x) => x.id === s.salaId);
                  return (
                    <option key={s.id} value={s.id}>
                      {f?.titulo || '—'} - {sa?.nome || '—'} - {new Date(s.datahora).toLocaleString('pt-BR')} (R$ {s.preco.toFixed(2)})
                    </option>
                  );
                })}
              </select>
              {sessaoInfo && <div className="small mt-1">{sessaoInfo}</div>}
            </div>
            <div>
              <label htmlFor="cliente" className="form-label">Nome do Cliente</label>
              <input id="cliente" name="cliente" className="form-control" required />
            </div>
            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input 
                id="cpf" 
                name="cpf" 
                className="form-control" 
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required 
              />
            </div>
            <div>
                <label htmlFor="assento" className="form-label">Assento</label>
                <select 
                    id="assento" 
                    name="assento"
                    className="form-select" 
                    value={assentoSelecionado}
                    onChange={(e) => setAssentoSelecionado(e.target.value)}
                    required
                >
                    <option value="">
                      {salaSelecionada ? 'Selecione um assento' : 'Antes, selecione uma sessão'}
                    </option>

                    {salaSelecionada && [
                      // Incluir assento sendo editado primeiro se existir
                      ...(editando && assentoSelecionado ? [assentoSelecionado] : []),
                      // Depois incluir assentos disponíveis (excluindo o que está sendo editado para não duplicar)
                      ...assentosDisponiveis
                        .filter(a => !assentosOcupados.includes(a) && a !== assentoSelecionado)
                    ].map(assento => (
                        <option key={assento} value={assento}>
                            {assento} {editando && assento === assentoSelecionado ? '(atual)' : ''}
                        </option>
                        ))
                    }
                </select>

                {salaSelecionada && (
                    <div className="form-text">
                    <i className="bi bi-info-circle"></i>
                    {' '}
                    {assentosDisponiveis.filter(a => !assentosOcupados.includes(a)).length} assentos disponíveis
                    </div>
                )}
            </div>

            <div>
              <label htmlFor="tipoIngresso" className="form-label">Tipo de Ingresso</label>
              <select 
                id="tipoIngresso" 
                name="tipoIngresso" 
                className="form-select" 
                value={tipoIngresso}
                onChange={(e) => setTipoIngresso(e.target.value as 'Inteira' | 'Meia')}
                required
              >
                <option value="Inteira">Inteira</option>
                <option value="Meia">Meia Entrada (50%)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Valor a Pagar</label>
              <div className="form-control fw-bold">
                {sessaoId ? `R$ ${precoCalculado.toFixed(2)}` : '—'}
              </div>
            </div>
            <div>
              <label htmlFor="pagamento" className="form-label">Tipo de Pagamento</label>
              <select id="pagamento" name="pagamento" className="form-select" required>
                <option value="">Selecione</option>
                <option>Cartão</option>
                <option>Pix</option>
                <option>Dinheiro</option>
              </select>
            </div>
          </div>

          <hr className="my-4" />
          <h3 className="h5 mb-3"><i className="bi bi-bag"></i> Adicionar Lanches (opcional)</h3>
              
              <div className="row g-3 mb-3">
                {lanches.map((lanche) => (
                  <div key={lanche.id} className="col-md-4">
                    <div className="card h-100 bg-dark border-secondary">
                      <div className="card-body">
                        <h5 className="card-title">{lanche.nome}</h5>
                        <p className="card-text text-success fw-bold">R$ {lanche.valorUnitario.toFixed(2)}</p>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => adicionarLanche(lanche)}
                        >
                          <i className="bi bi-plus-circle"></i> Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {carrinho.length > 0 && (
                <div className="card bg-dark border-secondary mb-3">
                  <div className="card-body">
                    <h5 className="card-title"><i className="bi bi-cart"></i> Seu Carrinho</h5>
                    <table className="table table-dark table-sm">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qtd</th>
                          <th>Preço Unit.</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrinho.map((item) => (
                          <tr key={item.lanche.id}>
                            <td>{item.lanche.nome}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button 
                                  type="button" 
                                  className="btn btn-outline-secondary"
                                  onClick={() => alterarQuantidade(item.lanche.id, item.quantidade - 1)}
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <span className="btn btn-dark">{item.quantidade}</span>
                                <button 
                                  type="button" 
                                  className="btn btn-outline-secondary"
                                  onClick={() => alterarQuantidade(item.lanche.id, item.quantidade + 1)}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td>R$ {item.lanche.valorUnitario.toFixed(2)}</td>
                            <td>R$ {(item.lanche.valorUnitario * item.quantidade).toFixed(2)}</td>
                            <td>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removerLanche(item.lanche.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="text-end fw-bold">Subtotal Lanches:</td>
                          <td className="fw-bold">R$ {totalLanches.toFixed(2)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              <div className="card bg-secondary text-white mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small>Ingresso: R$ {precoCalculado.toFixed(2)}</small>
                      {carrinho.length > 0 && (
                        <>
                          <br />
                          <small>Lanches: R$ {totalLanches.toFixed(2)}</small>
                        </>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="h5 mb-0">Total: R$ {totalGeral.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit">
              <i className={`bi bi-${editando ? 'check' : 'check-circle'}`}></i> {editando ? 'Atualizar Ingresso' : 'Confirmar Venda'}
            </button>
            {editando && (
              <button className="btn btn-secondary" type="button" onClick={handleCancelEdit}>
                <i className="bi bi-x"></i> Cancelar
              </button>
            )}
          </div>
        </form>

        <h2 className="h4 mt-4 mb-3">Ingressos vendidos</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>CPF</th>
                <th>Assento</th>
                <th>Sessão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {ingressos.map((ing) => {
                const s = sessoes.find((x) => x.id === ing.sessaoId);
                const f = s ? filmes.find((x) => x.id === s.filmeId) : null;
                const sa = s ? salas.find((x) => x.id === s.salaId) : null;
                return (
                  <tr key={ing.id}>
                    <td>{ing.cliente}</td>
                    <td>{ing.cpf}</td>
                    <td>{ing.assento}</td>
                    <td>
                      {f?.titulo || '—'} / {sa?.nome || '—'} / {s ? new Date(s.datahora).toLocaleString('pt-BR') : ''}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(ing)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            if (window.confirm(`Tem certeza que deseja excluir o ingresso de ${ing.cliente}?`)) {
                              try {
                                await deleteIngresso(ing.id);
                                setStatus({ type: 'ok', message: 'Ingresso excluído com sucesso!' });
                                updateSessaoInfo(sessaoId);
                              } catch (error) {
                                setStatus({ type: 'err', message: 'Erro ao excluir ingresso.' });
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
      </div>
    </div>
  );
}
