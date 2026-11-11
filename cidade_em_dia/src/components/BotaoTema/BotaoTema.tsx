import { useTema } from '../../contexto/TemaContexto';

// Botão do cabeçalho que troca entre modo claro e modo escuro.
// Mostra o ícone do modo para o qual vai mudar: lua no claro, sol no escuro.
export default function BotaoTema() {
  const { tema, alternarTema } = useTema();
  const escuro = tema === 'escuro';

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-marca-900 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-marca-700"
    >
      <svg
        viewBox="0 0 24 24"
        // A troca de ícone gira de leve, para dar retorno visual do clique.
        className={`h-6 w-6 transition-transform duration-500 ${escuro ? 'rotate-180 text-destaque-400' : ''}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {escuro ? (
          // Sol
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          // Lua
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
        )}
      </svg>
    </button>
  );
}
