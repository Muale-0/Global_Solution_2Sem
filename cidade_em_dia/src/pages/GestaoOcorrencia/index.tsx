import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Botao } from '../../components/Botao/Botao';
import CampoFormulario from '../../components/CampoFormulario/CampoFormulario';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import Cartao from '../../components/Cartao/Cartao';
import { Carregando, MensagemErro } from '../../components/EstadoApi/EstadoApi';
import LinhaDoTempo from '../../components/LinhaDoTempo/LinhaDoTempo';
import SeloStatus from '../../components/SeloStatus/SeloStatus';
import { useAviso } from '../../contexto/AvisoContexto';
import { infoStatus, transicoesPermitidas } from '../../dados/status';
import { mensagemDeErro } from '../../services/api';
import {
  buscarOcorrencia,
  listarAtualizacoes,
  registrarAtualizacao,
} from '../../services/ocorrenciaService';
import type { EstadoRequisicao } from '../../types/api';
import type { Atualizacao } from '../../types/atualizacao';
import type { Ocorrencia, StatusOcorrencia } from '../../types/ocorrencia';
import { marcarCamposInvalidos } from '../../utils/errosFormulario';
import { formatarDataHora, plural } from '../../utils/formatacao';
import { linkValido } from '../../utils/validacao';

interface DadosGestao {
  ocorrencia: Ocorrencia;
  atualizacoes: Atualizacao[];
}

// Campos do formulário, com os mesmos nomes do corpo que a API espera.
// O status começa vazio ('') até a pessoa escolher o novo.
interface FormularioAtualizacao {
  status: StatusOcorrencia | '';
  descricao: string;
  responsavel: string;
  urlEvidencia: string;
}

export default function GestaoOcorrencia() {
  const { id } = useParams();
  const ocorrenciaId = Number(id);
  const idValido = Number.isInteger(ocorrenciaId) && ocorrenciaId > 0;

  const { mostrarAviso } = useAviso();
  const [estado, setEstado] = useState<EstadoRequisicao<DadosGestao>>({
    status: 'carregando',
  });
  const [tentativa, setTentativa] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormularioAtualizacao>({
    mode: 'onTouched',
    defaultValues: { status: '', descricao: '', responsavel: '', urlEvidencia: '' },
  });

  // useWatch acompanha o valor de um campo: ao escolher "Concluída",
  // a evidência passa a ser obrigatória (regra da API).
  const statusEscolhido = useWatch({ control, name: 'status' });
  const vaiConcluir = statusEscolhido === 'CONCLUIDA';

  useEffect(() => {
    if (!idValido) return;

    let ativo = true;
    Promise.all([buscarOcorrencia(ocorrenciaId), listarAtualizacoes(ocorrenciaId)])
      .then(([ocorrencia, atualizacoes]) => {
        if (ativo) {
          setEstado({
            status: 'sucesso',
            dados: { ocorrencia, atualizacoes: atualizacoes ?? [] },
          });
        }
      })
      .catch((erro) => {
        if (ativo) setEstado({ status: 'erro', mensagem: mensagemDeErro(erro) });
      });

    return () => {
      ativo = false;
    };
  }, [ocorrenciaId, idValido, tentativa]);

  function tentarNovamente() {
    setEstado({ status: 'carregando' });
    setTentativa((atual) => atual + 1);
  }

  async function enviar(dados: FormularioAtualizacao) {
    // A validação já garante que há um status; esta checagem é para o TypeScript.
    if (!dados.status) return;

    setEnviando(true);
    setErroGeral('');
    try {
      await registrarAtualizacao(ocorrenciaId, {
        status: dados.status,
        descricao: dados.descricao.trim(),
        responsavel: dados.responsavel.trim(),
        urlEvidencia: dados.urlEvidencia.trim() || undefined,
      });
      mostrarAviso({
        tipo: 'sucesso',
        mensagem: `Status atualizado para ${infoStatus[dados.status].rotulo}.`,
      });
      // Limpa o formulário, mas mantém o responsável para a próxima atualização.
      reset({
        status: '',
        descricao: '',
        responsavel: getValues('responsavel'),
        urlEvidencia: '',
      });
      // Busca de novo para mostrar o status novo e a linha do tempo.
      setTentativa((atual) => atual + 1);
    } catch (erro) {
      const marcou = marcarCamposInvalidos<FormularioAtualizacao>(
        erro,
        ['status', 'descricao', 'responsavel', 'urlEvidencia'],
        setError,
      );
      // 409 (transição fora da ordem) cai aqui com a mensagem da API.
      setErroGeral(
        marcou ? 'Corrija os campos destacados e envie de novo.' : mensagemDeErro(erro),
      );
    } finally {
      setEnviando(false);
    }
  }

  if (!idValido) {
    return (
      <MensagemErro mensagem="O endereço desta ocorrência não é válido. Volte ao painel e escolha uma ocorrência." />
    );
  }

  if (estado.status === 'carregando') {
    return <Carregando texto="Buscando a ocorrência..." />;
  }

  if (estado.status === 'erro') {
    return (
      <div className="space-y-4">
        <MensagemErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />
        <p className="text-center">
          <Link to="/gestao" className="font-semibold text-marca-700 underline underline-offset-4">
            Voltar ao painel
          </Link>
        </p>
      </div>
    );
  }

  const { ocorrencia, atualizacoes } = estado.dados;
  // Status para os quais esta ocorrência pode ir agora.
  const proximosStatus = transicoesPermitidas[ocorrencia.status];
  const linkMapa = `https://www.openstreetmap.org/?mlat=${ocorrencia.latitude}&mlon=${ocorrencia.longitude}#map=18/${ocorrencia.latitude}/${ocorrencia.longitude}`;

  return (
    <article>
      <p className="mb-4">
        <Link to="/gestao" className="font-semibold text-marca-700 underline underline-offset-4">
          ← Voltar ao painel
        </Link>
      </p>

      <header className="mb-8">
        <p className="text-sm font-bold tracking-widest text-marca-700 uppercase">
          Gestão pública · Ocorrência nº {ocorrencia.id}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-balance break-words md:text-4xl">
          {ocorrencia.titulo}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <SeloStatus status={ocorrencia.status} />
          <span className="text-sm font-semibold text-slate-600">
            {ocorrencia.categoriaNome}
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Cartao>
            <h2 className="text-xl font-bold">Dados da ocorrência</h2>
            <p className="mt-3 leading-relaxed break-words whitespace-pre-line text-slate-700">
              {ocorrencia.descricao}
            </p>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-600">Endereço informado</dt>
                <dd className="font-semibold break-words">
                  {ocorrencia.endereco || 'Não informado'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Coordenadas</dt>
                <dd className="font-semibold">
                  {ocorrencia.latitude.toFixed(5)}, {ocorrencia.longitude.toFixed(5)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Registrada em</dt>
                <dd className="font-semibold">
                  {formatarDataHora(ocorrencia.dataAbertura)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Registrada por</dt>
                <dd className="font-semibold break-words">{ocorrencia.moradorNome}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Dias em aberto</dt>
                <dd className="font-semibold">
                  {plural(ocorrencia.diasEmAberto, 'dia', 'dias')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Confirmações</dt>
                <dd className="font-semibold">{ocorrencia.totalConfirmacoes}</dd>
              </div>
            </dl>

            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={linkMapa}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-marca-700 underline underline-offset-4"
              >
                Abrir local no mapa (nova aba)
              </a>
              {ocorrencia.urlFoto && (
                <a
                  href={ocorrencia.urlFoto}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-marca-700 underline underline-offset-4"
                >
                  Ver foto do problema (nova aba)
                </a>
              )}
            </p>
          </Cartao>

          <Cartao>
            <h2 className="text-xl font-bold">Histórico</h2>
            <div className="mt-5">
              <LinhaDoTempo
                dataAbertura={ocorrencia.dataAbertura}
                atualizacoes={atualizacoes}
              />
            </div>
          </Cartao>
        </div>

        <Cartao className="self-start">
          <h2 className="text-xl font-bold">Atualizar status</h2>

          {proximosStatus.length === 0 ? (
            <p className="mt-3 leading-relaxed text-slate-700">
              Esta ocorrência está{' '}
              <strong>{infoStatus[ocorrencia.status].rotulo.toLowerCase()}</strong>. Esse
              status é final e não pode mais ser alterado.
            </p>
          ) : (
            <form noValidate onSubmit={handleSubmit(enviar)} className="mt-4">
              <fieldset disabled={enviando} className="min-w-0 space-y-5">
                <legend className="sr-only">Nova atualização</legend>

                <CampoFormulario
                  id="status"
                  rotulo="Novo status"
                  erro={errors.status?.message}
                  ajuda={`Status atual: ${infoStatus[ocorrencia.status].rotulo}. Só aparecem as mudanças permitidas.`}
                >
                  <select
                    id="status"
                    aria-invalid={!!errors.status}
                    aria-describedby={errors.status ? 'status-erro' : 'status-ajuda'}
                    className={estiloCampo}
                    {...register('status', { required: 'Escolha o novo status.' })}
                  >
                    <option value="">Selecione...</option>
                    {proximosStatus.map((status) => (
                      <option key={status} value={status}>
                        {infoStatus[status].rotulo}
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

                <CampoFormulario
                  id="descricao"
                  rotulo="O que foi feito ou decidido"
                  erro={errors.descricao?.message}
                  ajuda="Este texto aparece para os moradores na linha do tempo."
                >
                  <textarea
                    id="descricao"
                    rows={4}
                    maxLength={500}
                    aria-invalid={!!errors.descricao}
                    aria-describedby={errors.descricao ? 'descricao-erro' : 'descricao-ajuda'}
                    className={estiloCampo}
                    placeholder="Ex.: Equipe de vistoria agendada."
                    {...register('descricao', {
                      required: 'Descreva a atualização.',
                      validate: (valor) =>
                        valor.trim().length >= 5 || 'Escreva pelo menos 5 caracteres.',
                    })}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="responsavel"
                  rotulo="Responsável"
                  erro={errors.responsavel?.message}
                >
                  <input
                    id="responsavel"
                    type="text"
                    maxLength={100}
                    aria-invalid={!!errors.responsavel}
                    aria-describedby={errors.responsavel ? 'responsavel-erro' : undefined}
                    className={estiloCampo}
                    placeholder="Ex.: Subprefeitura Vila Mariana"
                    {...register('responsavel', {
                      required: 'Informe o responsável.',
                      validate: (valor) =>
                        valor.trim().length >= 3 || 'Digite pelo menos 3 letras.',
                    })}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="urlEvidencia"
                  rotulo={
                    vaiConcluir
                      ? 'Link da evidência do serviço'
                      : 'Link da evidência do serviço (opcional)'
                  }
                  erro={errors.urlEvidencia?.message}
                  ajuda={
                    vaiConcluir
                      ? 'Obrigatório para concluir: foto do local depois do serviço.'
                      : 'Endereço de uma foto, começando com http:// ou https://.'
                  }
                >
                  <input
                    id="urlEvidencia"
                    type="url"
                    inputMode="url"
                    maxLength={300}
                    aria-invalid={!!errors.urlEvidencia}
                    aria-describedby={
                      errors.urlEvidencia ? 'urlEvidencia-erro' : 'urlEvidencia-ajuda'
                    }
                    className={estiloCampo}
                    placeholder="https://"
                    {...register('urlEvidencia', {
                      validate: (valor, valores) => {
                        const link = valor.trim();
                        if (!link) {
                          return (
                            valores.status !== 'CONCLUIDA' ||
                            'Informe a evidência para concluir a ocorrência.'
                          );
                        }
                        return (
                          linkValido(link) ||
                          'O link precisa começar com http:// ou https://.'
                        );
                      },
                    })}
                  />
                </CampoFormulario>

                {erroGeral && (
                  <p
                    role="alert"
                    className="rounded-lg border border-rose-200 bg-rose-50 p-3 font-medium text-rose-900"
                  >
                    {erroGeral}
                  </p>
                )}

                <Botao type="submit" className="w-full sm:w-auto">
                  {enviando ? 'Salvando...' : 'Registrar atualização'}
                </Botao>
              </fieldset>
            </form>
          )}
        </Cartao>
      </div>
    </article>
  );
}
