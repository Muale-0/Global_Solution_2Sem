import { Link } from 'react-router-dom';

const estiloLink =
  'underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function Rodape() {
  return (
    <footer className="border-t-4 border-destaque-400 bg-noite-950 text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-lg font-bold text-white">Cidade em Dia</p>
          <p className="mt-2 text-sm leading-relaxed">
            Informação organizada para cidades melhores. Plataforma de zeladoria
            urbana para registrar e acompanhar problemas de infraestrutura.
          </p>
        </div>

        <nav aria-label="Links do rodapé">
          <p className="font-semibold text-white">Navegação</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link to="/ocorrencias" className={estiloLink}>
                Ocorrências
              </Link>
            </li>
            <li>
              <Link to="/sobre" className={estiloLink}>
                Sobre o projeto
              </Link>
            </li>
            <li>
              <Link to="/faq" className={estiloLink}>
                Perguntas frequentes
              </Link>
            </li>
            <li>
              <Link to="/contato" className={estiloLink}>
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-semibold text-white">Projeto acadêmico</p>
          <p className="mt-2 text-sm leading-relaxed">
            Global Solution 2026/2 da FIAP, tema CitizenTech. Turma 1TDSPH.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Não substitui os canais oficiais da prefeitura nem atende emergências.
          </p>
        </div>
      </div>
    </footer>
  );
}
