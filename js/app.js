// Utilidades de armazenamento e helpers compartilhados
(function(){
  const STORAGE_KEYS = {
    filmes: 'filmes',
    salas: 'salas',
    sessoes: 'sessoes',
    ingressos: 'ingressos'
  };

  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  function load(key){
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e){
      console.error('Erro ao ler localStorage', key, e);
      return [];
    }
  }
  function save(key, value){
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e){
      alert('Falha ao salvar dados. Verifique o armazenamento do navegador.');
      console.error('Erro ao salvar localStorage', key, e);
    }
  }
  function addItem(key, item){
    const list = load(key);
    list.push(item);
    save(key, list);
    return item;
  }
  function findById(list, id){
    return list.find(x => x.id === id);
  }

  function getQuery(){
    return Object.fromEntries(new URLSearchParams(location.search).entries());
  }

  function formatDateTime(dt){
    try {
      const d = new Date(dt);
      return d.toLocaleString();
    } catch {
      return dt;
    }
  }

  function setStatus(el, type, msg){
    if(!el) return;
    el.innerHTML = `<div class="alert ${type === 'ok' ? 'ok' : 'err'}">${msg}</div>`;
  }

  function ensureSeeds(){
    // Garante arrays existirem no storage
    ['filmes','salas','sessoes','ingressos'].forEach(k => {
      if(!localStorage.getItem(k)) save(k, []);
    });
  }

  // Expondo API global simples
  window.Cinema = {
    STORAGE_KEYS,
    uid, load, save, addItem, findById,
    getQuery, formatDateTime, setStatus, ensureSeeds
  };

  // Executa em todas as páginas
  document.addEventListener('DOMContentLoaded', ensureSeeds);
})();