// Os cinco valores possíveis de status, iguais ao enum StatusOcorrencia da API.
export type StatusOcorrencia =
  | 'REGISTRADA'
  | 'EM_ANALISE'
  | 'EM_EXECUCAO'
  | 'CONCLUIDA'
  | 'DESCARTADA';

// Ocorrência como a API devolve.
export interface Ocorrencia {
  id: number;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  endereco: string | null;
  urlFoto: string | null;
  status: StatusOcorrencia;
  dataAbertura: string;
  categoriaId: number;
  categoriaNome: string;
  moradorId: number;
  moradorNome: string;
  totalConfirmacoes: number;
  diasEmAberto: number;
}

// Corpo enviado em POST /ocorrencias.
export interface OcorrenciaPayload {
  categoriaId: number;
  moradorId: number;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  urlFoto?: string;
}

// Filtros aceitos por GET /ocorrencias?status=&categoriaId=
export interface FiltrosOcorrencia {
  status?: StatusOcorrencia;
  categoriaId?: number;
}
