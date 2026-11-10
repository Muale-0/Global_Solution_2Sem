import { useEffect, useState } from 'react';
import CartaoOcorrencia from '../../components/CartaoOcorrencia/CartaoOcorrencia';
import { Carregando, MensagemErro, SemDados } from '../../components/EstadoApi/EstadoApi';
import FiltrosOcorrencias from '../../components/FiltrosOcorrencias/FiltrosOcorrencias';
import Revelar from '../../components/Revelar/Revelar';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { infoStatus, listaStatus } from '../../dados/status';
import { mensagemDeErro } from '../../services/api';
import { listarCategorias } from '../../services/categoriaService';
import { listarOcorrencias } from '../../services/ocorrenciaService';
import type { EstadoRequisicao } from '../../types/api';
import type { Categoria } from '../../types/categoria';
import type { FiltrosOcorrencia, Ocorrencia } from '../../types/ocorrencia';

export default function Gestao() {
  const [estado, setEstado] = useState<EstadoRequisicao<Ocorrencia[]>>({
    status: 'carregando',
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtros, setFiltros] = useState<FiltrosOcorrencia>({});
  const [tentativa, setTentativa] = useState(0);

  // O painel busca todas as ocorrências de uma vez, porque precisa do total
  // de cada status. Os filtros daqui são aplicados no próprio navegador.
  useEffect(() => {
    let ativo = true;
    Promise.all([listarOcorrencias(), listarCategorias()])
      .then(([ocorrencias, listaCategorias]) => {
        if (ativo) {
          setEstado({ status: 'sucesso', dados: ocorrencias ?? [] });
          setCategorias(listaCategorias ?? []);
        }
      })
      .catch((erro) => {
        if (ativo) setEstado({ status: 'erro', mensagem: mensagemDeErro(erro) });
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  function tentarNovamente() {
    setEstado({ status: 'carregando' });
    setTentativa((atual) => atual + 1);
  }

  const todas = estado.status === 'sucesso' ? estado.dados : [];

  const filtradas = todas
    .filter((ocorrencia) => !filtros.status || ocorrencia.status === filtros.status)
    .filter(
      (ocorrencia) =>
        !filtros.categoriaId || ocorrencia.categoriaId === filtros.categoriaId,
    );

  return (
    <>
      <TituloPagina
        sobretitulo="Gestão pública"
        titulo="Painel de ocorrências"
        descricao="Consulte as demandas dos moradores e registre o andamento de cada uma."
      />

      <p className="mb-6 rounded-xl border border-marca-200 bg-marca-50 p-4 text-sm text-marca-900">
        Área destinada às equipes da gestão pública. Nesta versão do projeto o
        painel ainda não exige login.
      </p>

      {estado.status === 'carregando' && <Carregando texto="Carregando o painel..." />}

      {estado.status === 'erro' && (
        <MensagemErro mensagem={estado.mensagem} aoTentarNovamente={tentarNovamente} />
      )}

      {estado.status === 'sucesso' && (
        <>
          {/* Um botão por status, com o total. Clicar filtra a lista. */}
          <section aria-labelledby="titulo-resumo">
            <h2 id="titulo-resumo" className="text-xl font-bold">
              Resumo por status
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              {listaStatus.map((status) => {
                const total = todas.filter((o) => o.status === status).length;
                const selecionado = filtros.status === status;
                return (
                  <li key={status}>
                    <button
                      type="button"
                      // aria-pressed indica que o botão funciona como liga/desliga.
                      aria-pressed={selecionado}
                      onClick={() =>
                        setFiltros({ ...filtros, status: selecionado ? undefined : status })
                      }
                      className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-700 ${
                        selecionado
                          ? 'border-marca-700 bg-marca-50'
                          : 'border-slate-200 bg-superficie hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-3xl font-bold">{total}</span>
                      <span className="mt-1 block text-sm font-semibold text-slate-700">
                        {infoStatus[status].rotulo}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="titulo-lista" className="mt-10">
            <h2 id="titulo-lista" className="text-xl font-bold">
              Ocorrências
            </h2>
            <p className="mt-1 mb-4 text-sm text-slate-600">
              Ordenadas das mais confirmadas para as menos confirmadas.
            </p>

            <FiltrosOcorrencias
              filtros={filtros}
              categorias={categorias}
              aoMudar={setFiltros}
            />

            <div className="mt-6">
              {filtradas.length === 0 ? (
                <SemDados
                  titulo="Nenhuma ocorrência nesta seleção"
                  texto={
                    todas.length === 0
                      ? 'Ainda não há ocorrências registradas pelos moradores.'
                      : 'Mude o status ou a categoria para ver outras ocorrências.'
                  }
                />
              ) : (
                <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filtradas.map((ocorrencia, indice) => (
                    <li key={ocorrencia.id}>
                      <Revelar atraso={(indice % 3) * 100} className="h-full">
                        <CartaoOcorrencia
                          ocorrencia={ocorrencia}
                          destino={`/gestao/ocorrencias/${ocorrencia.id}`}
                          rotuloLink="Analisar e atualizar"
                          mostrarCoordenadas
                        />
                      </Revelar>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
