import type { CampoInvalido, RespostaErro } from '../types/api';

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Endereço base da API Java. Vem do arquivo .env.local (no computador)
// ou das variáveis de ambiente da Vercel (no site publicado).
// O replace tira barras sobrando no final, para não gerar "//ocorrencias".
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

type DetalhesErro = Pick<RespostaErro, 'campos' | 'ocorrenciaExistenteId'>;

// Erro próprio do projeto: além da mensagem, guarda o status HTTP e os
// detalhes que a API manda (campos inválidos e ocorrência duplicada).
export class ErroApi extends Error {
  status: number;
  campos: CampoInvalido[];
  ocorrenciaExistenteId?: number;

  constructor(mensagem: string, status: number, detalhes?: DetalhesErro | null) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
    this.campos = detalhes?.campos ?? [];
    this.ocorrenciaExistenteId = detalhes?.ocorrenciaExistenteId;
  }
}

// Mensagem usada quando a API não manda uma mensagem própria.
function mensagemPadrao(status: number) {
  if (status === 400) return 'Os dados enviados não são válidos.';
  if (status === 401) return 'E-mail ou senha inválidos.';
  if (status === 404) return 'O registro procurado não foi encontrado.';
  if (status === 409) return 'A operação não é permitida pelas regras do sistema.';
  if (status >= 500) return 'A API está com problemas. Tente novamente em instantes.';
  return `A API respondeu com um erro inesperado (${status}).`;
}

// Converte texto em JSON sem quebrar se a resposta não for JSON.
function lerJson(texto: string): unknown {
  try {
    return JSON.parse(texto);
  } catch {
    return undefined;
  }
}

/**
 * Função única por onde passam todas as chamadas à API.
 * O <T> é um "tipo genérico": quem chama diz o formato esperado da resposta,
 * por exemplo requisitar<Ocorrencia[]>('/ocorrencias').
 */
export async function requisitar<T>(
  caminho: string,
  metodo: MetodoHttp = 'GET',
  corpo?: object,
): Promise<T> {
  if (!API_URL) {
    throw new ErroApi('O endereço da API não foi configurado (VITE_API_URL).', 0);
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    // O fetch só cai aqui quando nem chegou a ter resposta (sem internet,
    // API desligada ou ainda "acordando" no Render).
    throw new ErroApi(
      'Não foi possível conectar à API. No primeiro acesso ela pode levar até um minuto para iniciar. Tente novamente.',
      0,
    );
  }

  // Lê como texto primeiro porque respostas 204 vêm sem corpo.
  const texto = await resposta.text();
  const dados = texto ? lerJson(texto) : undefined;

  // resposta.ok é true para status de 200 a 299.
  if (!resposta.ok) {
    const erro = dados as RespostaErro | undefined;
    const mensagem =
      resposta.status < 500 && erro?.mensagem
        ? erro.mensagem
        : mensagemPadrao(resposta.status);
    throw new ErroApi(mensagem, resposta.status, erro);
  }

  return dados as T;
}

// Transforma qualquer erro em um texto para mostrar na tela.
export function mensagemDeErro(erro: unknown) {
  return erro instanceof Error ? erro.message : 'Ocorreu um erro inesperado.';
}
