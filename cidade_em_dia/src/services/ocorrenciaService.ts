import type { Atualizacao, AtualizacaoPayload } from '../types/atualizacao';
import type { Confirmacao, ConfirmacaoPayload } from '../types/confirmacao';
import type {
  FiltrosOcorrencia,
  Ocorrencia,
  OcorrenciaPayload,
} from '../types/ocorrencia';
import { requisitar } from './api';

// GET /ocorrencias?status=&categoriaId=
// URLSearchParams monta o trecho depois do "?" só com os filtros preenchidos.
export function listarOcorrencias(filtros: FiltrosOcorrencia = {}) {
  const parametros = new URLSearchParams();
  if (filtros.status) parametros.set('status', filtros.status);
  if (filtros.categoriaId) parametros.set('categoriaId', String(filtros.categoriaId));

  const consulta = parametros.toString();
  return requisitar<Ocorrencia[]>(`/ocorrencias${consulta ? `?${consulta}` : ''}`);
}

// GET /ocorrencias/{id}
export function buscarOcorrencia(id: number) {
  return requisitar<Ocorrencia>(`/ocorrencias/${id}`);
}

// POST /ocorrencias
export function registrarOcorrencia(ocorrencia: OcorrenciaPayload) {
  return requisitar<Ocorrencia | undefined>('/ocorrencias', 'POST', ocorrencia);
}

// GET /ocorrencias/{id}/atualizacoes
export function listarAtualizacoes(ocorrenciaId: number) {
  return requisitar<Atualizacao[]>(`/ocorrencias/${ocorrenciaId}/atualizacoes`);
}

// POST /ocorrencias/{id}/atualizacoes — é aqui que o status muda.
export function registrarAtualizacao(
  ocorrenciaId: number,
  atualizacao: AtualizacaoPayload,
) {
  return requisitar<Atualizacao | undefined>(
    `/ocorrencias/${ocorrenciaId}/atualizacoes`,
    'POST',
    atualizacao,
  );
}

// GET /ocorrencias/{id}/confirmacoes
export function listarConfirmacoes(ocorrenciaId: number) {
  return requisitar<Confirmacao[]>(`/ocorrencias/${ocorrenciaId}/confirmacoes`);
}

// POST /ocorrencias/{id}/confirmacoes
export function confirmarOcorrencia(
  ocorrenciaId: number,
  confirmacao: ConfirmacaoPayload,
) {
  return requisitar<Confirmacao | undefined>(
    `/ocorrencias/${ocorrenciaId}/confirmacoes`,
    'POST',
    confirmacao,
  );
}
