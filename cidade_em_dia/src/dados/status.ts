import type { StatusOcorrencia } from '../types/ocorrencia';

interface InfoStatus {
  rotulo: string;
  descricao: string;
  // Classes do Tailwind usadas no selo colorido.
  classes: string;
}

// Ordem em que os status aparecem nos filtros e no painel.
export const listaStatus: StatusOcorrencia[] = [
  'REGISTRADA',
  'EM_ANALISE',
  'EM_EXECUCAO',
  'CONCLUIDA',
  'DESCARTADA',
];

// Record<Chave, Valor> obriga a ter uma entrada para cada status:
// se a API ganhar um status novo, o TypeScript avisa que falta aqui.
export const infoStatus: Record<StatusOcorrencia, InfoStatus> = {
  REGISTRADA: {
    rotulo: 'Registrada',
    descricao: 'Aguardando análise da gestão pública.',
    classes: 'bg-slate-200 text-slate-800',
  },
  EM_ANALISE: {
    rotulo: 'Em análise',
    descricao: 'A gestão pública está avaliando a ocorrência.',
    classes: 'bg-amber-100 text-amber-900',
  },
  EM_EXECUCAO: {
    rotulo: 'Em execução',
    descricao: 'O serviço relacionado à ocorrência foi iniciado.',
    classes: 'bg-marca-100 text-marca-900',
  },
  CONCLUIDA: {
    rotulo: 'Concluída',
    descricao: 'Encerramento informado pela gestão pública.',
    classes: 'bg-emerald-100 text-emerald-900',
  },
  DESCARTADA: {
    rotulo: 'Descartada',
    descricao: 'Avaliada pela gestão pública e não levada adiante.',
    classes: 'bg-rose-100 text-rose-900',
  },
};

// Mesmas transições que a API aceita. Qualquer outra volta erro 409.
export const transicoesPermitidas: Record<StatusOcorrencia, StatusOcorrencia[]> = {
  REGISTRADA: ['EM_ANALISE', 'DESCARTADA'],
  EM_ANALISE: ['EM_EXECUCAO', 'DESCARTADA'],
  EM_EXECUCAO: ['CONCLUIDA'],
  CONCLUIDA: [],
  DESCARTADA: [],
};

// CONCLUIDA e DESCARTADA são finais: não mudam mais nem recebem confirmação.
export function statusEncerrado(status: StatusOcorrencia) {
  return status === 'CONCLUIDA' || status === 'DESCARTADA';
}
