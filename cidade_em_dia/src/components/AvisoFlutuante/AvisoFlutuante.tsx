import { useAviso } from '../../contexto/AvisoContexto';
import type { TipoAviso } from '../../types/site';

const estiloPorTipo: Record<TipoAviso, string> = {
  sucesso: 'border-emerald-300 bg-emerald-50 text-emerald-950',
  erro: 'border-rose-300 bg-rose-50 text-rose-950',
  info: 'border-marca-200 bg-marca-50 text-marca-900',
};

// Mensagem que aparece no rodapé da tela depois de uma ação
// (ex.: "Ocorrência registrada com sucesso"). Some sozinha após alguns segundos.
export default function AvisoFlutuante() {
  const { aviso, limparAviso } = useAviso();

  if (!aviso) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div
        // Erros usam "alert" (anunciado na hora); os demais usam "status".
        role={aviso.tipo === 'erro' ? 'alert' : 'status'}
        className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg ${estiloPorTipo[aviso.tipo]}`}
      >
        <p className="flex-1 font-medium break-words">{aviso.mensagem}</p>
        <button
          type="button"
          onClick={limparAviso}
          aria-label="Fechar aviso"
          className="-m-1 rounded-md p-1 text-xl leading-none hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current"
        >
          ×
        </button>
      </div>
    </div>
  );
}
