import Cartao from '../../components/Cartao/Cartao';
import Revelar from '../../components/Revelar/Revelar';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { integrantes } from '../../dados/integrantes';

const estiloLink =
  'font-semibold text-marca-700 underline underline-offset-4 hover:text-marca-900';

export default function Integrantes() {
  return (
    <>
      <TituloPagina
        sobretitulo="Equipe"
        titulo="Integrantes"
        descricao="Grupo responsável pelo Cidade em Dia na Global Solution 2026/2 da FIAP."
      />

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {integrantes.map((integrante, indice) => (
          <li key={integrante.rm}>
            {/* Os cartões surgem um depois do outro, 100 ms de diferença. */}
            <Revelar atraso={indice * 100} className="h-full">
              {/* "group": a foto reage quando o mouse passa no cartão. */}
              <Cartao className="group flex h-full flex-col items-center text-center transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <img
                  src={integrante.foto}
                  alt={`Foto de ${integrante.nome}`}
                  width={112}
                  height={112}
                  loading="lazy"
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-marca-100 transition duration-300 group-hover:scale-105 group-hover:ring-destaque-400"
                />
                <h2 className="mt-4 text-lg font-bold break-words">{integrante.nome}</h2>
                <p className="mt-1 text-slate-600">
                  RM{integrante.rm} · Turma {integrante.turma}
                </p>
                <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                  <a
                    href={integrante.github}
                    target="_blank"
                    rel="noreferrer"
                    className={estiloLink}
                    aria-label={`GitHub de ${integrante.nome} (abre em nova aba)`}
                  >
                    GitHub
                  </a>
                  <a
                    href={integrante.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={estiloLink}
                    aria-label={`LinkedIn de ${integrante.nome} (abre em nova aba)`}
                  >
                    LinkedIn
                  </a>
                </p>
              </Cartao>
            </Revelar>
          </li>
        ))}
      </ul>
    </>
  );
}