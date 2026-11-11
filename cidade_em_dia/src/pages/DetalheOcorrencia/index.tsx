import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Botao, LinkBotao } from '../../components/Botao/Botao';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import Cartao from '../../components/Cartao/Cartao';
import { Carregando, MensagemErro } from '../../components/EstadoApi/EstadoApi';
import LinhaDoTempo from '../../components/LinhaDoTempo/LinhaDoTempo';
import SeloStatus from '../../components/SeloStatus/SeloStatus';
import { useAviso } from '../../contexto/AvisoContexto';
import { useSessao } from '../../contexto/SessaoContexto';
import { infoStatus, statusEncerrado } from '../../dados/status';
import { mensagemDeErro } from '../../services/api';
import {
  buscarOcorrencia,
  confirmarOcorrencia,
  listarAtualizacoes,
  listarConfirmacoes,
} from '../../services/ocorrenciaService';
import type { EstadoRequisicao } from '../../types/api';
import type { Atualizacao } from '../../types/atualizacao';
import type { Confirmacao } from '../../types/confirmacao';
import type { Ocorrencia } from '../../types/ocorrencia';
import { formatarData, formatarDataHora, plural } from '../../utils/formatacao';

// Tudo o que a página precisa, buscado em três chamadas à API.
interface DadosDetalhe {
  ocorrencia: Ocorrencia;
  atualizacoes: Atualizacao[];
  confirmacoes: Confirmacao[];
}

export default function DetalheOcorrencia() {
  // useParams lê o ":id" da rota. Em /ocorrencias/7, id vale "7" (texto).
  const { id } = useParams();
  const ocorrenciaId = Number(id);
  const idValido = Number.isInteger(ocorrenciaId) && ocorrenciaId > 0;

  const { morador } = useSessao();
  const { mostrarAviso } = useAviso();

  const [estado, setEstado] = useState<EstadoRequisicao<DadosDetalhe>>({
    status: 'carregando',
  });
  const [tentativa, setTentativa] = useState(0);
  const [comentario, setComentario] = useState('');
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (!idValido) return;

    let ativo = true;
    // Promise.all dispara as três buscas ao mesmo tempo e espera todas.
    Promise.all([
      buscarOcorrencia(ocorrenciaId),
      listarAtualizacoes(ocorrenciaId),
      listarConfirmacoes(ocorrenciaId),
    ])
      .then(([ocorrencia, atualizacoes, confirmacoes]) => {
        if (ativo) {
          setEstado({
            status: 'sucesso',
            dados: {
              ocorrencia,
              atualizacoes: atualizacoes ?? [],
              confirmacoes: confirmacoes ?? [],
            },
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

  async function confirmar() {
    if (!morador) return;

    setConfirmando(true);
    try {
      await confirmarOcorrencia(ocorrenciaId, {
        moradorId: morador.id,
        // Comentário é opcional: se estiver vazio, o campo nem é enviado.
        comentario: comentario.trim() || undefined,
      });
      mostrarAviso({ tipo: 'sucesso', mensagem: 'Confirmação registrada. Obrigado!' });
      setComentario('');
      // Busca os dados de novo para atualizar o total de confirmações.
      setTentativa((atual) => atual + 1);
    } catch (erro) {
      mostrarAviso({ tipo: 'erro', mensagem: mensagemDeErro(erro) });
    } finally {
      setConfirmando(false);
    }
  }

  if (!idValido) {
    return (
      <MensagemErro mensagem="O endereço desta ocorrência não é válido. Volte para a lista e escolha uma ocorrência." />
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
          <Link
            to="/ocorrencias"
            className="font-semibold text-marca-700 underline underline-offset-4"
          >
            Voltar para a lista de ocorrências
          </Link>
        </p>
      </div>
    );
  }

  const { ocorrencia, atualizacoes, confirmacoes } = estado.dados;
  const encerrada = statusEncerrado(ocorrencia.status);
  const ehAutor = morador?.id === ocorrencia.moradorId;
  const jaConfirmou = confirmacoes.some(
    (confirmacao) => confirmacao.moradorId === morador?.id,
  );

  return (
    <article>
      <p className="mb-4">
        <Link
          to="/ocorrencias"
          className="font-semibold text-marca-700 underline underline-offset-4"
        >
          ← Voltar para a lista
        </Link>
      </p>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <SeloStatus status={ocorrencia.status} />
          <span className="text-sm font-semibold text-slate-600">
            {ocorrencia.categoriaNome}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-balance break-words md:text-4xl">
          {ocorrencia.titulo}
        </h1>
        <p className="mt-2 text-slate-600">{infoStatus[ocorrencia.status].descricao}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Cartao>
            <h2 className="text-xl font-bold">Descrição</h2>
            <p className="mt-3 leading-relaxed break-words whitespace-pre-line text-slate-700">
              {ocorrencia.descricao}
            </p>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-600">Local</dt>
                <dd className="font-semibold break-words">
                  {ocorrencia.endereco || 'Endereço não informado'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-600">Registrada em</dt>
                <dd className="font-semibold">
                  {formatarData(ocorrencia.dataAbertura)}
                  {!encerrada &&
                    ` (há ${plural(ocorrencia.diasEmAberto, 'dia', 'dias')})`}
                </dd>
              </div>
            </dl>

            {ocorrencia.urlFoto && (
              <a
                href={ocorrencia.urlFoto}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block font-semibold text-marca-700 underline underline-offset-4"
              >
                Ver foto do problema (abre em nova aba)
              </a>
            )}

            {ehAutor && (
              <p className="mt-5 rounded-lg bg-marca-50 p-3 text-sm font-semibold text-marca-900">
                Você registrou esta ocorrência.
              </p>
            )}
          </Cartao>

          <Cartao>
            <h2 className="text-xl font-bold">Andamento</h2>
            <div className="mt-5">
              <LinhaDoTempo
                dataAbertura={ocorrencia.dataAbertura}
                atualizacoes={atualizacoes}
              />
            </div>
          </Cartao>
        </div>

        <div className="space-y-6">
          <Cartao>
            <h2 className="text-xl font-bold">Confirmações</h2>
            <p className="mt-2 text-3xl font-bold text-marca-800">
              {confirmacoes.length}
            </p>
            <p className="text-sm text-slate-600">
              {confirmacoes.length === 1
                ? 'morador confirmou este problema'
                : 'moradores confirmaram este problema'}
            </p>

            {/* Só uma destas situações aparece por vez. */}
            <div className="mt-5 border-t border-slate-200 pt-5">
              {encerrada ? (
                <p className="text-sm text-slate-600">
                  Ocorrência encerrada. Não recebe novas confirmações.
                </p>
              ) : !morador ? (
                <>
                  <p className="text-sm text-slate-700">
                    Você também viu este problema? Entre na sua conta para confirmar.
                  </p>
                  <LinkBotao
                    to={`/entrar?voltar=/ocorrencias/${ocorrencia.id}`}
                    className="mt-3 w-full"
                  >
                    Entrar para confirmar
                  </LinkBotao>
                </>
              ) : ehAutor ? (
                <p className="text-sm text-slate-600">
                  Quem registrou a ocorrência não pode confirmá-la. Outros moradores
                  podem.
                </p>
              ) : jaConfirmou ? (
                <p className="text-sm font-semibold text-emerald-800">
                  Você já confirmou esta ocorrência. Obrigado!
                </p>
              ) : (
                <>
                  <label
                    htmlFor="comentario"
                    className="mb-1.5 block text-sm font-semibold"
                  >
                    Comentário (opcional)
                  </label>
                  <textarea
                    id="comentario"
                    rows={3}
                    maxLength={255}
                    value={comentario}
                    onChange={(evento) => setComentario(evento.target.value)}
                    disabled={confirmando}
                    className={estiloCampo}
                    placeholder="Ex.: Continua do mesmo jeito."
                  />
                  <Botao
                    onClick={confirmar}
                    disabled={confirmando}
                    className="mt-3 w-full"
                  >
                    {confirmando ? 'Confirmando...' : 'Confirmar que o problema existe'}
                  </Botao>
                </>
              )}
            </div>
          </Cartao>

          {confirmacoes.some((confirmacao) => confirmacao.comentario) && (
            <Cartao>
              <h2 className="text-xl font-bold">Comentários</h2>
              <ul className="mt-4 space-y-4">
                {confirmacoes
                  .filter((confirmacao) => confirmacao.comentario)
                  .map((confirmacao) => (
                    <li key={confirmacao.id} className="border-l-2 border-marca-200 pl-3">
                      <p className="break-words text-slate-700">
                        “{confirmacao.comentario}”
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatarDataHora(confirmacao.dataConfirmacao)}
                      </p>
                    </li>
                  ))}
              </ul>
            </Cartao>
          )}
        </div>
      </div>
    </article>
  );
}
