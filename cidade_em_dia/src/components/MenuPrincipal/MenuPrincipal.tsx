import { NavLink } from 'react-router-dom';
import { useSessao } from '../../contexto/SessaoContexto';
import { primeiroNome } from '../../utils/formatacao';

type MenuPrincipalProps = {
  // No celular e no tablet o menu abre e fecha pelo botão do cabeçalho.
  aberto: boolean;
  // Chamado ao clicar em um link, para fechar o menu.
  aoNavegar: () => void;
};

// Os links ficam em uma lista para o JSX não repetir o mesmo bloco várias vezes.
const itens = [
  { para: '/', rotulo: 'Início' },
  { para: '/ocorrencias', rotulo: 'Ocorrências' },
  { para: '/gestao', rotulo: 'Gestão' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/contato', rotulo: 'Contato' },
];

const estiloLink =
  'block rounded-lg px-3 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-700';

// O NavLink avisa se o link é o da página atual (isActive),
// e a gente usa isso para destacar o item.
function classesDoLink({ isActive }: { isActive: boolean }) {
  const cor = isActive
    ? 'bg-marca-50 text-marca-800'
    : 'text-slate-700 hover:bg-slate-100';
  return `${estiloLink} ${cor}`;
}

export default function MenuPrincipal({ aberto, aoNavegar }: MenuPrincipalProps) {
  const { morador, sair } = useSessao();

  function encerrarSessao() {
    sair();
    aoNavegar();
  }

  return (
    <nav
      id="menu-principal"
      aria-label="Navegação principal"
      // Abaixo de 1280px (xl) o menu só aparece quando "aberto" é true.
      // De 1280px para cima ele fica sempre visível, em linha.
      className={`${aberto ? 'block' : 'hidden'} w-full xl:block xl:w-auto`}
    >
      <ul className="flex flex-col gap-1 pt-3 pb-1 xl:flex-row xl:items-center xl:p-0">
        {itens.map((item) => (
          <li key={item.para}>
            <NavLink
              to={item.para}
              // "end" faz o Início só ficar ativo exatamente em "/".
              end={item.para === '/'}
              onClick={aoNavegar}
              className={classesDoLink}
            >
              {item.rotulo}
            </NavLink>
          </li>
        ))}

        {morador ? (
          <li className="mt-2 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 xl:mt-0 xl:ml-2 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-4">
            <span className="px-3 text-sm text-slate-700 xl:px-0">
              Olá, <strong>{primeiroNome(morador.nome)}</strong>
            </span>
            <button
              type="button"
              onClick={encerrarSessao}
              className={`${estiloLink} text-marca-700 hover:bg-marca-50`}
            >
              Sair
            </button>
          </li>
        ) : (
          <li className="mt-2 border-t border-slate-200 pt-3 xl:mt-0 xl:ml-2 xl:border-t-0 xl:pt-0">
            <NavLink
              to="/entrar"
              onClick={aoNavegar}
              className={`${estiloLink} bg-acao text-center text-sobre-acao hover:bg-acao-forte xl:px-4`}
            >
              Entrar
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
