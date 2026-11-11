import type { StatusOcorrencia } from './ocorrencia';

// Cada mudança de status feita pela gestão, como a API devolve.
export interface Atualizacao {
  id: number;
  ocorrenciaId: number;
  statusAnterior: StatusOcorrencia;
  statusNovo: StatusOcorrencia;
  descricao: string;
  responsavel: string;
  urlEvidencia: string | null;
  dataAtualizacao: string;
}

// Corpo enviado em POST /ocorrencias/{id}/atualizacoes.
export interface AtualizacaoPayload {
  status: StatusOcorrencia;
  descricao: string;
  responsavel: string;
  urlEvidencia?: string;
}
