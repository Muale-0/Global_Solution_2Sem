import { useEffect, useState } from 'react';
import { LinkBotao } from '../../components/Botao/Botao';
import CartaoOcorrencia from '../../components/CartaoOcorrencia/CartaoOcorrencia';
import { Carregando, MensagemErro, SemDados } from '../../components/EstadoApi/EstadoApi';
import FiltrosOcorrencias from '../../components/FiltrosOcorrencias/FiltrosOcorrencias';
import Revelar from '../../components/Revelar/Revelar';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { useSessao } from '../../contexto/SessaoContexto';
import { mensagemDeErro } from '../../services/api';
import { listarCategorias } from '../../services/categoriaService';
import { listarOcorrencias } from '../../services/ocorrenciaService';
import type { EstadoRequisicao } from '../../types/api';
import type { Categoria } from '../../types/categoria';
import type { FiltrosOcorrencia, Ocorrencia } from '../../types/ocorrencia';
import { plural } from '../../utils/formatacao';

export default function Ocorrencias() {
  const { morador } = useSessao();

  const [filtros, setFiltros] = useState<FiltrosOcorrencia>({});
  const [soMinhas, setSoMinhas] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estado, setEstado] = useState<EstadoRequisicao<Ocorrencia[]>>({
    status: 'carregando',
  });
  // Somar 1 aqui faz o useEffect da lista rodar de novo ("Tentar novamente").
  const [tentativa, setTentativa] = useState(0);

  // Busca as categorias uma vez, para montar o filtro.
  useEffect(() => {
    let ativo = true;
    listarCategorias()
      .then((lista) => {
        if (ativo) setCategorias(lista ?? []);
      })
      .catch(() => {
        // Sem categorias a página continua funcionando, só sem esse filtro.
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Busca as ocorrências sempre que os filtros mudam.
  // "ativo" evita atualizar a tela com uma resposta antiga, que chegou
  // depois de a pessoa já ter trocado o filtro ou saído da página.
  useEffect(() => {
    let ativo = true;
    listarOcorrencias(filtros)
      .then((lista) => {
        if (ativo) setEstado({ status: 'sucesso', dados: lista ?? [] });
      })
      .catch((erro) => {
        if (ativo) setEstado({ status: 'erro', mensagem: mensagemDeErro(erro) });
      });
    return () => {
      ativo = false;
    };
  }, [filtros, tentativa]);

  function mudarFiltros(novosFiltros: FiltrosOcorrencia) {
    setEstado({ status: 'carregando' });
    setFiltros(novosFiltros);
  }

  function tentarNovamente() {
    setEstado({ status: 'carregando' });
    setTentativa((atual) => atual + 1);
  }

  // A API filtra por status e categoria. "Só as minhas" é filtrado aqui,
  // comparando o moradorId de cada ocorrência com o de quem está logado.
  const visiveis =
    estado.status === 'sucesso'
      ? estado.dados.filter(
          (ocorrencia) => !soMinhas || ocorrencia.moradorId === morador?.id,
        )
      : [];

  const temFiltro = Boolean(filtros.status || filtros.categoriaId || soMinhas);

  return (
    <>
      <TituloPagina
        sobretitulo="Ocorrências"
        titulo="Problemas registrados pelos moradores"
        descricao="Acompanhe o andamento de cada registro. As ocorrências mais confirmadas aparecem primeiro."
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <FiltrosOcorrencias
            filtros={filtros}
            categorias={categorias}
            aoMudar={mudarFiltros}
          />
          {morador && (
            <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={soMinhas}
                onChange={(evento) => setSoMinhas(evento.target.checked)}
                className="h-5 w-5 accent-marca-700"
              />
              Mostrar só as que eu registrei
            </label>
          )}
        </div>
        <LinkBotao to="/ocorrencias/nova" className="md:mb-0.5">
          Registrar ocorrência
        </LinkBotao>
      </div>

      {estado.status === 'carregando' && <Carregando texto="Buscando ocorrências..." />}

      {estado.status === 'erro' && (
        <MensagemErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />
      )}

      {estado.status === 'sucesso' && visiveis.length === 0 && (
        <SemDados
          titulo="Nenhuma ocorrência encontrada"
          texto={
            temFiltro
              ? 'Não há ocorrências com os filtros escolhidos. Tente mudar o status ou a categoria.'
              : 'Ainda não há ocorrências registradas. Que tal registrar a primeira?'
          }
        >
          <LinkBotao to="/ocorrencias/nova">Registrar ocorrência</LinkBotao>
        </SemDados>
      )}

      {estado.status === 'sucesso' && visiveis.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-600" aria-live="polite">
            {plural(visiveis.length, 'ocorrência encontrada', 'ocorrências encontradas')}
          </p>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiveis.map((ocorrencia, indice) => (
              <li key={ocorrencia.id}>
                {/* Os cartões surgem em sequência; o % 3 reinicia o atraso
                    a cada linha de três, para não acumular espera. */}
                <Revelar atraso={(indice % 3) * 100} className="h-full">
                  <CartaoOcorrencia
                    ocorrencia={ocorrencia}
                    destino={`/ocorrencias/${ocorrencia.id}`}
                  />
                </Revelar>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
