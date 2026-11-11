import { LinkBotao } from '../../components/Botao/Botao';
import Cartao from '../../components/Cartao/Cartao';
import Logo from '../../components/Logo/Logo';
import Revelar from '../../components/Revelar/Revelar';

const passos = [
  {
    numero: '1',
    titulo: 'Você registra',
    texto: 'Escolha a categoria, descreva o problema e informe onde ele está.',
  },
  {
    numero: '2',
    titulo: 'A vizinhança confirma',
    texto: 'Outros moradores confirmam que o problema existe, sem criar registros repetidos.',
  },
  {
    numero: '3',
    titulo: 'A gestão responde',
    texto: 'A gestão pública analisa, executa o serviço e informa cada mudança de status.',
  },
];

const problemas = [
  { icone: '🚧', nome: 'Buracos', texto: 'Vias e pavimento danificados.' },
  { icone: '🌧️', nome: 'Alagamentos', texto: 'Pontos que acumulam água.' },
  { icone: '💡', nome: 'Iluminação', texto: 'Postes e lâmpadas com defeito.' },
  { icone: '🗑️', nome: 'Lixo', texto: 'Lixo e entulho acumulados.' },
  { icone: '♿', nome: 'Acessibilidade', texto: 'Calçadas e rampas com obstáculos.' },
  { icone: '🌳', nome: 'Arborização', texto: 'Árvores sem poda ou com risco de queda.' },
];

const objetivos = [
  { numero: '9', nome: 'Indústria, inovação e infraestrutura' },
  { numero: '11', nome: 'Cidades e comunidades sustentáveis' },
  { numero: '16', nome: 'Paz, justiça e instituições eficazes' },
];

// Etiquetas decorativas que flutuam no destaque, lembrando o caminho
// de uma ocorrência: registrada, em análise, concluída.
const etiquetas = [
  { texto: 'Registrada', posicao: 'top-6 right-40', atraso: '0s' },
  { texto: 'Em análise', posicao: 'top-1/2 right-6', atraso: '1.5s' },
  { texto: 'Concluída', posicao: 'right-44 bottom-8', atraso: '3s' },
];

export default function Home() {
  return (
    <div className="space-y-14 md:space-y-20">
      {/* Destaque principal. As cores daqui são fixas: a faixa é escura
          tanto no modo claro quanto no escuro. */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-azul-800 via-noite-900 to-noite-950 px-6 py-12 text-white shadow-xl md:px-12 md:py-20">
        {/* Enfeites de fundo: malha de pontos e dois brilhos desfocados.
            aria-hidden esconde dos leitores de tela; -z-10 põe atrás do texto. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[size:26px_26px]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-20 -z-10 h-72 w-72 rounded-full bg-destaque-400/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-20 -z-10 h-72 w-72 rounded-full bg-azul-600/40 blur-3xl"
        />

        {/* Ilustração flutuante, só em telas grandes. */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-96 lg:block">
          <Logo className="absolute top-1/2 right-28 h-32 w-32 -translate-y-1/2 animate-flutuar drop-shadow-2xl" />
          {etiquetas.map((etiqueta) => (
            <span
              key={etiqueta.texto}
              style={{ animationDelay: etiqueta.atraso }}
              className={`absolute ${etiqueta.posicao} animate-flutuar rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur`}
            >
              {etiqueta.texto}
            </span>
          ))}
        </div>

        {/* Cada linha entra com um pequeno atraso em relação à anterior. */}
        <p className="animate-surgir text-sm font-bold tracking-widest text-destaque-300 uppercase">
          Zeladoria urbana em São Paulo
        </p>
        <h1 className="mt-3 max-w-2xl animate-surgir text-3xl font-bold text-balance [animation-delay:120ms] md:text-5xl">
          Viu um problema na sua rua?{' '}
          <span className="text-destaque-400">Registre e acompanhe</span> até o fim.
        </h1>
        <p className="mt-4 max-w-xl animate-surgir text-lg leading-relaxed text-white/80 [animation-delay:240ms]">
          O Cidade em Dia reúne em um só lugar os problemas de infraestrutura
          apontados pelos moradores e as respostas da gestão pública.
        </p>
        <div className="mt-8 flex animate-surgir flex-col gap-3 [animation-delay:360ms] sm:flex-row">
          <LinkBotao to="/ocorrencias/nova" variante="destaque">
            Registrar ocorrência
          </LinkBotao>
          <LinkBotao to="/ocorrencias" variante="transparente">
            Ver ocorrências
          </LinkBotao>
        </div>
      </section>

      {/* Como funciona */}
      <section aria-labelledby="titulo-como-funciona">
        <Revelar>
          <h2 id="titulo-como-funciona" className="text-2xl font-bold md:text-3xl">
            Como funciona
          </h2>
        </Revelar>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {passos.map((passo, indice) => (
            <li key={passo.numero}>
              {/* atraso: cada cartão aparece 120 ms depois do anterior. */}
              <Revelar atraso={indice * 120} className="h-full">
                <Cartao className="h-full hover:shadow-md">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-acao font-bold text-sobre-acao"
                  >
                    {passo.numero}
                  </span>
                  <h3 className="mt-4 text-xl font-bold">{passo.titulo}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{passo.texto}</p>
                </Cartao>
              </Revelar>
            </li>
          ))}
        </ol>
      </section>

      {/* O que pode ser registrado */}
      <section aria-labelledby="titulo-problemas">
        <Revelar>
          <h2 id="titulo-problemas" className="text-2xl font-bold md:text-3xl">
            O que você pode registrar
          </h2>
        </Revelar>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {problemas.map((problema, indice) => (
            <li key={problema.nome}>
              <Revelar atraso={indice * 80} className="h-full">
                {/* "group" permite que o ícone reaja ao mouse sobre o cartão. */}
                <div className="group h-full rounded-2xl border border-slate-200 bg-superficie p-4 transition duration-300 hover:-translate-y-1 hover:border-destaque-400 hover:shadow-md md:p-5">
                  <span
                    aria-hidden="true"
                    className="inline-block text-3xl transition-transform duration-300 group-hover:scale-125"
                  >
                    {problema.icone}
                  </span>
                  <h3 className="mt-2 font-bold break-words">{problema.nome}</h3>
                  <p className="mt-1 text-sm text-slate-600">{problema.texto}</p>
                </div>
              </Revelar>
            </li>
          ))}
        </ul>
      </section>

      {/* Dois ambientes */}
      <section aria-labelledby="titulo-ambientes">
        <Revelar>
          <h2 id="titulo-ambientes" className="text-2xl font-bold md:text-3xl">
            Dois ambientes, uma mesma informação
          </h2>
        </Revelar>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Revelar className="h-full">
            <Cartao className="flex h-full flex-col border-t-4 border-t-marca-600 hover:shadow-md">
              <h3 className="text-xl font-bold">Para moradores</h3>
              <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                Registre problemas, confirme os que você também viu e acompanhe a
                linha do tempo de cada ocorrência.
              </p>
              <LinkBotao to="/cadastro" className="mt-5 self-start">
                Criar minha conta
              </LinkBotao>
            </Cartao>
          </Revelar>
          <Revelar atraso={120} className="h-full">
            <Cartao className="flex h-full flex-col border-t-4 border-t-destaque-400 hover:shadow-md">
              <h3 className="text-xl font-bold">Para a gestão pública</h3>
              <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                Veja as demandas por status e categoria, com as mais confirmadas
                primeiro, e registre cada etapa do atendimento.
              </p>
              <LinkBotao to="/gestao" variante="secundario" className="mt-5 self-start">
                Abrir painel da gestão
              </LinkBotao>
            </Cartao>
          </Revelar>
        </div>
      </section>

      {/* ODS */}
      <section aria-labelledby="titulo-ods">
        <Revelar>
          <h2 id="titulo-ods" className="text-2xl font-bold md:text-3xl">
            Objetivos de Desenvolvimento Sustentável
          </h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-slate-600">
            O projeto se conecta a três objetivos da Agenda 2030 da ONU.
          </p>
        </Revelar>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {objetivos.map((objetivo, indice) => (
            <li key={objetivo.numero}>
              <Revelar atraso={indice * 120} className="h-full">
                <div className="flex h-full items-center gap-4 rounded-2xl bg-marca-50 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destaque-400 text-lg font-bold text-black">
                    {objetivo.numero}
                  </span>
                  <span className="font-semibold text-marca-900">
                    <span className="sr-only">ODS {objetivo.numero}: </span>
                    {objetivo.nome}
                  </span>
                </div>
              </Revelar>
            </li>
          ))}
        </ul>
      </section>

      {/* Chamada final */}
      <Revelar>
        <section
          aria-labelledby="titulo-chamada"
          className="flex flex-col items-start gap-5 rounded-3xl bg-linear-to-r from-noite-950 to-azul-800 px-6 py-10 text-white md:flex-row md:items-center md:justify-between md:px-12"
        >
          <div>
            <h2 id="titulo-chamada" className="text-2xl font-bold md:text-3xl">
              Sua rua merece estar em dia.
            </h2>
            <p className="mt-2 text-white/80">
              Leva menos de dois minutos para registrar um problema.
            </p>
          </div>
          <LinkBotao to="/ocorrencias/nova" variante="destaque" className="shrink-0">
            Registrar agora
          </LinkBotao>
        </section>
      </Revelar>
    </div>
  );
}
