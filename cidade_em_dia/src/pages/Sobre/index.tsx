
import Cartao from '../../components/Cartao/Cartao';
import Revelar from '../../components/Revelar/Revelar';
import TituloPagina from '../../components/TituloPagina/TituloPagina';

const naoFaz = [
  'Não substitui os canais oficiais de atendimento da prefeitura.',
  'Não atende emergências nem despacha equipes de resgate.',
  'Não garante prazo para a solução de uma ocorrência.',
  'Não faz verificação técnica independente dos serviços concluídos.',
];

const tecnologias = [
  'React, Vite e TypeScript no front-end',
  'Tailwind CSS para o visual responsivo',
  'API REST em Java com Spring Boot',
  'Banco de dados Oracle',
];

export default function Sobre() {
  return (
    <>
      <TituloPagina
        sobretitulo="Sobre"
        titulo="Informação organizada para cidades melhores"
        descricao="O Cidade em Dia é uma plataforma de zeladoria urbana que aproxima moradores e gestão pública."
      />

      {/* Cada cartão fica dentro de <Revelar>, que o faz surgir ao rolar.
          O atraso alterna entre 0 e 120 ms para as duas colunas. */}
      <div className="grid gap-5 md:grid-cols-2">
        <Revelar className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">O problema</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Buracos, alagamentos, postes apagados e calçadas quebradas afetam a
              mobilidade, a segurança e a acessibilidade. Quando os avisos dos
              moradores ficam espalhados, é difícil saber onde os problemas se
              concentram e em que pé está cada um.
            </p>
          </Cartao>
        </Revelar>

        <Revelar atraso={120} className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">A proposta</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Centralizar os registros em um ambiente único. O morador informa o
              problema, a vizinhança confirma e a gestão pública registra cada
              etapa do atendimento, com histórico visível para todos.
            </p>
          </Cartao>
        </Revelar>

        <Revelar className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">Para quem é</h2>
            <dl className="mt-3 space-y-3 text-slate-700">
              <div>
                <dt className="font-semibold">Moradores</dt>
                <dd className="leading-relaxed">
                  Registram ocorrências, confirmam as de outros moradores e
                  acompanham o andamento. O uso é gratuito.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Gestão pública</dt>
                <dd className="leading-relaxed">
                  Consulta as demandas por status e categoria e atualiza o
                  andamento de cada uma, sempre com uma descrição.
                </dd>
              </div>
            </dl>
          </Cartao>
        </Revelar>

        <Revelar atraso={120} className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">O que a plataforma não faz</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
              {naoFaz.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Cartao>
        </Revelar>

        <Revelar className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">Privacidade</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              A localização registrada é a do problema, não a da casa do morador.
              Nas páginas públicas aparece apenas o endereço informado, sem
              coordenadas exatas e sem o nome de quem registrou.
            </p>
          </Cartao>
        </Revelar>

        <Revelar atraso={120} className="h-full">
          <Cartao className="h-full">
            <h2 className="text-xl font-bold">O projeto</h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Solução desenvolvida para a Global Solution 2026/2 da FIAP, tema
              CitizenTech, pela turma 1TDSPH. Tecnologias utilizadas:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
              {tecnologias.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Cartao>
        </Revelar>
      </div>
    </>
  );
}
