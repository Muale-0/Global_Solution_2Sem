// Intl.DateTimeFormat é do próprio JavaScript: formata datas no padrão do Brasil.
const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });
const formatoDataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

// A API manda datas como "2026-11-10T14:30:00". Se vier algo inesperado,
// mostramos o texto original em vez de "Invalid Date".
function formatar(iso: string, formato: Intl.DateTimeFormat) {
  const data = new Date(iso);
  return Number.isNaN(data.getTime()) ? iso : formato.format(data);
}

// "2026-11-10T14:30:00" -> "10/11/2026"
export function formatarData(iso: string) {
  return formatar(iso, formatoData);
}

// "2026-11-10T14:30:00" -> "10/11/2026, 14:30"
export function formatarDataHora(iso: string) {
  return formatar(iso, formatoDataHora);
}

// "Maria Souza" -> "Maria"
export function primeiroNome(nomeCompleto: string) {
  return nomeCompleto.trim().split(' ')[0];
}

// 1 -> "1 dia", 3 -> "3 dias"
export function plural(quantidade: number, singular: string, pluralDaPalavra: string) {
  return `${quantidade} ${quantidade === 1 ? singular : pluralDaPalavra}`;
}
