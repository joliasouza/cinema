export const uid = (): string => 
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const formatDateTime = (dt: string): string => {
  try {
    return new Date(dt).toLocaleString('pt-BR');
  } catch {
    return dt;
  }
};

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

// Formata data para exibição (dd/mm/yyyy)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Remove timezone e pega apenas a data
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

// Corrige problema de timezone ao salvar data do input type="date"
export const normalizeDateString = (dateString: string): string => {
  if (!dateString) return dateString;
  
  // Se já tem timezone ou hora, retorna como está
  if (dateString.includes('T') || dateString.includes('Z')) {
    return dateString;
  }
  
  // Para input type="date" que retorna "YYYY-MM-DD"
  // Adiciona horário meio-dia para evitar problemas de timezone
  return `${dateString}T12:00:00`;
};
