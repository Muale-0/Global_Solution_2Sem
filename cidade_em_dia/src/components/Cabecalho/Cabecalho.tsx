import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgressoRolagem } from '../../hooks/useProgressoRolagem';
import BotaoTema from '../BotaoTema/BotaoTema';
import Logo from '../Logo/Logo';
import MenuPrincipal from '../MenuPrincipal/MenuPrincipal';

export default function Cabecalho() {
  // Guarda se o menu está aberto (só importa em telas menores que 1280px).
  const [menuAberto, setMenuAberto] = useState(false);
  // Quanto da página já foi rolado, de 0 a 1.
  const progresso = useProgressoRolagem();

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header
      // Fundo levemente transparente com desfoque; ganha sombra ao rolar.
      className={`sticky top-0 z-30 border-b border-slate-200 bg-superficie/90 backdrop-blur transition-shadow duration-300 ${
        progresso > 0 ? 'shadow-md' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 py-3 md:px-6">
        <Link
          to="/"
          onClick={fecharMenu}
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marca-700"
        >
          {/* group-hover: o logo reage quando o mouse passa no link inteiro. */}
          <Logo className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
          <span className="text-lg font-bold text-marca-900">Cidade em Dia</span>
        </Link>

        {/* xl:order-last: em telas grandes os botões vão para depois do menu. */}
        <div className="flex items-center gap-1 xl:order-last">
          <BotaoTema />

          {/* Botão "hambúrguer": some em telas grandes (xl:hidden). */}
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            // Informam ao leitor de tela o que o botão controla e se está aberto.
            aria-expanded={menuAberto}
            aria-controls="menu-principal"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-marca-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-marca-700 xl:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuAberto ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <MenuPrincipal aberto={menuAberto} aoNavegar={fecharMenu} />
      </div>

      {/* Barra amarela que cresce conforme a página é rolada.
          scaleX estica a barra de 0% a 100% a partir da esquerda. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-destaque-400"
        style={{ transform: `scaleX(${progresso})` }}
      />
    </header>
  );
}
