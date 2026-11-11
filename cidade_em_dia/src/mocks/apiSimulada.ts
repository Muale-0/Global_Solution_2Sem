// TEMPORÁRIO — imita as respostas da API Java usando os dados de exemplo.
// Só é carregado quando VITE_USAR_MOCK=true no .env.local.
// APAGAR A PASTA src/mocks ANTES DA ENTREGA (o PDF não aceita mocks).

import { ErroApi } from '../services/api';
import type { AtualizacaoPayload } from '../types/atualizacao';
import type { ConfirmacaoPayload } from '../types/confirmacao';
import type { LoginPayload, MoradorPayload } from '../types/morador';
import type {
  Ocorrencia,
  OcorrenciaPayload,
  StatusOcorrencia,
} from '../types/ocorrencia';
import {
  atualizacoes,
  categorias,
  confirmacoes,
  moradores,
  ocorrencias,
  senhas,
  type OcorrenciaGuardada,
} from './dadosExemplo';

const transicoes: Record<StatusOcorrencia, StatusOcorrencia[]> = {
  REGISTRADA: ['EM_ANALISE', 'DESCARTADA'],
  EM_ANALISE: ['EM_EXECUCAO', 'DESCARTADA'],
  EM_EXECUCAO: ['CONCLUIDA'],
  CONCLUIDA: [],
  DESCARTADA: [],
};

function agora() {
  return new Date().toISOString().slice(0, 19);
}

function proximoId(lista: { id: number }[]) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

function encerrada(status: StatusOcorrencia) {
  return status === 'CONCLUIDA' || status === 'DESCARTADA';
}

// Distância aproximada em metros entre dois pontos próximos.
function distanciaEmMetros(a: OcorrenciaPayload, b: OcorrenciaGuardada) {
  const metrosPorGrau = 111_320;
  const dLat = (a.latitude - b.latitude) * metrosPorGrau;
  const dLon =
    (a.longitude - b.longitude) *
    metrosPorGrau *
    Math.cos((a.latitude * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

// Junta os campos que a API calcula na hora.
function montarOcorrencia(guardada: OcorrenciaGuardada): Ocorrencia {
  const dias = Math.floor(
    (Date.now() - new Date(guardada.dataAbertura).getTime()) / 86_400_000,
  );
  return {
    ...guardada,
    categoriaNome: categorias.find((c) => c.id === guardada.categoriaId)?.nome ?? '',
    moradorNome: moradores.find((m) => m.id === guardada.moradorId)?.nome ?? '',
    totalConfirmacoes: confirmacoes.filter((c) => c.ocorrenciaId === guardada.id).length,
    diasEmAberto: Math.max(0, dias),
  };
}

function listarOcorrencias(consulta: URLSearchParams) {
  const status = consulta.get('status');
  const categoriaId = Number(consulta.get('categoriaId'));
  return ocorrencias
    .filter((o) => !status || o.status === status)
    .filter((o) => !categoriaId || o.categoriaId === categoriaId)
    .map(montarOcorrencia)
    .sort((a, b) => b.totalConfirmacoes - a.totalConfirmacoes);
}

function registrarOcorrencia(dados: OcorrenciaPayload) {
  if (!categorias.some((c) => c.id === dados.categoriaId)) {
    throw new ErroApi('Categoria não encontrada.', 400);
  }
  const duplicada = ocorrencias.find(
    (o) =>
      o.categoriaId === dados.categoriaId &&
      !encerrada(o.status) &&
      distanciaEmMetros(dados, o) <= 30,
  );
  if (duplicada) {
    throw new ErroApi(
      `Já existe uma ocorrência aberta desta categoria a 30 metros (id ${duplicada.id}). Confirme a ocorrência existente em vez de registrar outra.`,
      409,
      { ocorrenciaExistenteId: duplicada.id },
    );
  }
  const nova: OcorrenciaGuardada = {
    id: proximoId(ocorrencias),
    titulo: dados.titulo,
    descricao: dados.descricao,
    latitude: dados.latitude,
    longitude: dados.longitude,
    endereco: dados.endereco ?? null,
    urlFoto: dados.urlFoto ?? null,
    status: 'REGISTRADA',
    dataAbertura: agora(),
    categoriaId: dados.categoriaId,
    moradorId: dados.moradorId,
  };
  ocorrencias.push(nova);
  return montarOcorrencia(nova);
}

function registrarAtualizacao(ocorrencia: OcorrenciaGuardada, dados: AtualizacaoPayload) {
  if (!transicoes[ocorrencia.status].includes(dados.status)) {
    throw new ErroApi(
      `Não é possível mudar de ${ocorrencia.status} para ${dados.status}.`,
      409,
    );
  }
  if (dados.status === 'CONCLUIDA' && !dados.urlEvidencia) {
    throw new ErroApi('Os dados enviados não são válidos.', 400, {
      campos: [
        { campo: 'urlEvidencia', mensagem: 'Informe a evidência para concluir a ocorrência.' },
      ],
    });
  }
  const nova = {
    id: proximoId(atualizacoes),
    ocorrenciaId: ocorrencia.id,
    statusAnterior: ocorrencia.status,
    statusNovo: dados.status,
    descricao: dados.descricao,
    responsavel: dados.responsavel,
    urlEvidencia: dados.urlEvidencia ?? null,
    dataAtualizacao: agora(),
  };
  ocorrencia.status = dados.status;
  atualizacoes.push(nova);
  return nova;
}

function confirmar(ocorrencia: OcorrenciaGuardada, dados: ConfirmacaoPayload) {
  const morador = moradores.find((m) => m.id === dados.moradorId);
  if (!morador) throw new ErroApi('Morador não encontrado.', 400);
  if (encerrada(ocorrencia.status)) {
    throw new ErroApi('Ocorrências encerradas não recebem confirmação.', 409);
  }
  if (ocorrencia.moradorId === morador.id) {
    throw new ErroApi('O autor não pode confirmar a própria ocorrência.', 409);
  }
  const repetida = confirmacoes.some(
    (c) => c.ocorrenciaId === ocorrencia.id && c.moradorId === morador.id,
  );
  if (repetida) throw new ErroApi('Você já confirmou esta ocorrência.', 409);

  const nova = {
    id: proximoId(confirmacoes),
    ocorrenciaId: ocorrencia.id,
    moradorId: morador.id,
    moradorNome: morador.nome,
    comentario: dados.comentario ?? null,
    dataConfirmacao: agora(),
  };
  confirmacoes.push(nova);
  return nova;
}

function cadastrarMorador(dados: MoradorPayload) {
  if (moradores.some((m) => m.email === dados.email)) {
    throw new ErroApi('Já existe um morador com este e-mail.', 409);
  }
  if (moradores.some((m) => m.cpf === dados.cpf)) {
    throw new ErroApi('Já existe um morador com este CPF.', 409);
  }
  const novo = {
    id: proximoId(moradores),
    nome: dados.nome,
    email: dados.email,
    cpf: dados.cpf,
    telefone: dados.telefone,
    subprefeitura: dados.subprefeitura,
    dataCadastro: agora(),
  };
  moradores.push(novo);
  senhas.set(novo.id, dados.senha);
  return novo;
}

function fazerLogin(dados: LoginPayload) {
  const morador = moradores.find((m) => m.email === dados.email);
  if (!morador || senhas.get(morador.id) !== dados.senha) {
    throw new ErroApi('E-mail ou senha inválidos.', 401);
  }
  return morador;
}

// Decide qual função responde, olhando o método e o caminho.
function rotear(caminho: string, metodo: string, corpo: unknown): unknown {
  const [rota, consulta = ''] = caminho.split('?');
  const [recurso, segundo, terceiro] = rota.split('/').filter(Boolean);

  if (recurso === 'categorias' && metodo === 'GET') return categorias;

  if (recurso === 'moradores' && metodo === 'POST') {
    return segundo === 'login'
      ? fazerLogin(corpo as LoginPayload)
      : cadastrarMorador(corpo as MoradorPayload);
  }

  if (recurso === 'ocorrencias') {
    if (!segundo) {
      return metodo === 'GET'
        ? listarOcorrencias(new URLSearchParams(consulta))
        : registrarOcorrencia(corpo as OcorrenciaPayload);
    }

    const ocorrencia = ocorrencias.find((o) => o.id === Number(segundo));
    if (!ocorrencia) throw new ErroApi('Ocorrência não encontrada.', 404);

    if (!terceiro) return montarOcorrencia(ocorrencia);

    if (terceiro === 'atualizacoes') {
      return metodo === 'GET'
        ? atualizacoes.filter((a) => a.ocorrenciaId === ocorrencia.id)
        : registrarAtualizacao(ocorrencia, corpo as AtualizacaoPayload);
    }

    if (terceiro === 'confirmacoes') {
      return metodo === 'GET'
        ? confirmacoes.filter((c) => c.ocorrenciaId === ocorrencia.id)
        : confirmar(ocorrencia, corpo as ConfirmacaoPayload);
    }
  }

  throw new ErroApi('Rota não encontrada.', 404);
}

export async function responderMock<T>(
  caminho: string,
  metodo: string,
  corpo?: object,
): Promise<T> {
  // Espera um pouco para dar tempo de ver o estado de carregamento.
  await new Promise((resolver) => setTimeout(resolver, 500));
  // structuredClone devolve uma cópia, como uma resposta de rede faria.
  return structuredClone(rotear(caminho, metodo, corpo)) as T;
}
