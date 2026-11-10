// TEMPORÁRIO — dados de exemplo para desenvolver enquanto a API Java não está no ar.
// APAGAR A PASTA src/mocks ANTES DA ENTREGA (o PDF não aceita mocks).

import type { Atualizacao } from '../types/atualizacao';
import type { Categoria } from '../types/categoria';
import type { Confirmacao } from '../types/confirmacao';
import type { Morador } from '../types/morador';
import type { Ocorrencia } from '../types/ocorrencia';

// A ocorrência guardada não tem os campos que a API calcula na hora.
export type OcorrenciaGuardada = Omit<
  Ocorrencia,
  'categoriaNome' | 'moradorNome' | 'totalConfirmacoes' | 'diasEmAberto'
>;

export const categorias: Categoria[] = [
  { id: 1, nome: 'Buraco', descricao: 'Buracos e vias danificadas' },
  { id: 2, nome: 'Alagamento', descricao: 'Pontos de acúmulo de água' },
  { id: 3, nome: 'Iluminação', descricao: 'Postes e lâmpadas com defeito' },
  { id: 4, nome: 'Lixo', descricao: 'Lixo e entulho acumulados' },
  { id: 5, nome: 'Acessibilidade', descricao: 'Calçadas e rampas com obstáculos' },
  { id: 6, nome: 'Arborização', descricao: 'Árvores com risco de queda ou sem poda' },
];

export const moradores: Morador[] = [
  { id: 1, nome: 'Maria Souza', email: 'maria.souza@email.com', cpf: '52998224725', telefone: '11987654321', subprefeitura: 'Vila Mariana', dataCadastro: '2026-10-01T10:00:00' },
  { id: 2, nome: 'João Lima', email: 'joao.lima@email.com', cpf: '11144477735', telefone: '11976543210', subprefeitura: 'Sé', dataCadastro: '2026-10-02T11:30:00' },
  { id: 3, nome: 'Ana Ferreira', email: 'ana.ferreira@email.com', cpf: '39053344705', telefone: '11965432109', subprefeitura: 'Pinheiros', dataCadastro: '2026-10-03T09:15:00' },
  { id: 4, nome: 'Carlos Pereira', email: 'carlos.pereira@email.com', cpf: '86288366757', telefone: '11954321098', subprefeitura: 'Ipiranga', dataCadastro: '2026-10-04T14:45:00' },
  { id: 5, nome: 'Beatriz Santos', email: 'beatriz.santos@email.com', cpf: '71460238001', telefone: '11943210987', subprefeitura: 'Lapa', dataCadastro: '2026-10-05T16:20:00' },
];

// Senha de cada morador de exemplo (id -> senha).
export const senhas = new Map<number, string>(
  moradores.map((morador) => [morador.id, '123456']),
);

export const ocorrencias: OcorrenciaGuardada[] = [
  { id: 1, titulo: 'Buraco na frente da padaria', descricao: 'Buraco fundo que enche de água quando chove e já estourou pneu de carro.', latitude: -23.5935, longitude: -46.6402, endereco: 'Rua Vergueiro, 3000', urlFoto: null, status: 'EM_ANALISE', dataAbertura: '2026-10-30T08:40:00', categoriaId: 1, moradorId: 3 },
  { id: 2, titulo: 'Poste apagado há uma semana', descricao: 'O poste em frente ao ponto de ônibus está apagado e a rua fica muito escura à noite.', latitude: -23.5898, longitude: -46.6351, endereco: 'Rua Domingos de Morais, 1500', urlFoto: null, status: 'REGISTRADA', dataAbertura: '2026-11-04T19:10:00', categoriaId: 3, moradorId: 1 },
  { id: 3, titulo: 'Alagamento na esquina quando chove', descricao: 'A boca de lobo está entupida e a esquina alaga em qualquer chuva mais forte.', latitude: -23.5861, longitude: -46.6269, endereco: 'Av. Lins de Vasconcelos, 2100', urlFoto: null, status: 'EM_EXECUCAO', dataAbertura: '2026-10-20T07:55:00', categoriaId: 2, moradorId: 2 },
  { id: 4, titulo: 'Calçada quebrada impede cadeira de rodas', descricao: 'Trecho da calçada afundou e quem usa cadeira de rodas precisa ir pela rua.', latitude: -23.5952, longitude: -46.6448, endereco: 'Rua Sena Madureira, 800', urlFoto: null, status: 'CONCLUIDA', dataAbertura: '2026-10-05T13:25:00', categoriaId: 5, moradorId: 4 },
  { id: 5, titulo: 'Lixo acumulado na praça', descricao: 'Sacos de lixo deixados ao lado dos bancos da praça há vários dias.', latitude: -23.5919, longitude: -46.6309, endereco: 'Praça Santíssimo Sacramento', urlFoto: null, status: 'DESCARTADA', dataAbertura: '2026-10-12T10:05:00', categoriaId: 4, moradorId: 5 },
];

export const atualizacoes: Atualizacao[] = [
  { id: 1, ocorrenciaId: 1, statusAnterior: 'REGISTRADA', statusNovo: 'EM_ANALISE', descricao: 'Equipe de vistoria agendada.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-11-02T09:00:00' },
  { id: 2, ocorrenciaId: 3, statusAnterior: 'REGISTRADA', statusNovo: 'EM_ANALISE', descricao: 'Vistoria confirmou a boca de lobo entupida.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-10-22T10:30:00' },
  { id: 3, ocorrenciaId: 3, statusAnterior: 'EM_ANALISE', statusNovo: 'EM_EXECUCAO', descricao: 'Equipe de limpeza de galerias enviada ao local.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-10-27T08:15:00' },
  { id: 4, ocorrenciaId: 4, statusAnterior: 'REGISTRADA', statusNovo: 'EM_ANALISE', descricao: 'Vistoria realizada.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-10-07T11:00:00' },
  { id: 5, ocorrenciaId: 4, statusAnterior: 'EM_ANALISE', statusNovo: 'EM_EXECUCAO', descricao: 'Obra de reparo da calçada iniciada.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-10-14T08:00:00' },
  { id: 6, ocorrenciaId: 4, statusAnterior: 'EM_EXECUCAO', statusNovo: 'CONCLUIDA', descricao: 'Calçada refeita e rampa instalada.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: 'https://exemplo.com/evidencia-calcada.jpg', dataAtualizacao: '2026-10-21T16:40:00' },
  { id: 7, ocorrenciaId: 5, statusAnterior: 'REGISTRADA', statusNovo: 'DESCARTADA', descricao: 'A coleta regular já havia retirado o lixo quando a equipe chegou.', responsavel: 'Subprefeitura Vila Mariana', urlEvidencia: null, dataAtualizacao: '2026-10-13T15:10:00' },
];

export const confirmacoes: Confirmacao[] = [
  { id: 1, ocorrenciaId: 1, moradorId: 1, moradorNome: 'Maria Souza', comentario: 'Passei hoje e continua do mesmo jeito.', dataConfirmacao: '2026-10-31T18:20:00' },
  { id: 2, ocorrenciaId: 1, moradorId: 2, moradorNome: 'João Lima', comentario: null, dataConfirmacao: '2026-11-01T07:45:00' },
  { id: 3, ocorrenciaId: 2, moradorId: 3, moradorNome: 'Ana Ferreira', comentario: 'Muito perigoso à noite.', dataConfirmacao: '2026-11-05T21:05:00' },
  { id: 4, ocorrenciaId: 3, moradorId: 1, moradorNome: 'Maria Souza', comentario: null, dataConfirmacao: '2026-10-21T12:00:00' },
  { id: 5, ocorrenciaId: 3, moradorId: 4, moradorNome: 'Carlos Pereira', comentario: 'Alagou de novo ontem.', dataConfirmacao: '2026-10-23T09:30:00' },
  { id: 6, ocorrenciaId: 3, moradorId: 5, moradorNome: 'Beatriz Santos', comentario: null, dataConfirmacao: '2026-10-24T17:15:00' },
];
