import { useId, useState } from 'react';

type PerguntaFaqProps = {
  pergunta: string;
  resposta: string;
};

// Item de "sanfona": clicar na pergunta abre ou fecha a resposta.
export default function PerguntaFaq({ pergunta, resposta }: PerguntaFaqProps) {
  const [aberta, setAberta] = useState(false);
  // useId gera um id único, para ligar o botão à resposta (aria-controls).
  const idResposta = useId();

  return (
    <div className="rounded-xl border border-slate-200 bg-superficie transition-shadow duration-300 hover:shadow-md">
      <h3>
        <button
          type="button"
          aria-expanded={aberta}
          aria-controls={idResposta}
          onClick={() => setAberta(!aberta)}
          className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-4 text-left font-semibold hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-marca-700 md:px-5"
        >
          <span>{pergunta}</span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-xl text-marca-700 transition-transform ${aberta ? 'rotate-45' : ''}`}
          >
            +
          </span>
        </button>
      </h3>
      <div id={idResposta} hidden={!aberta} className="px-4 pb-4 md:px-5">
        <p className="animate-surgir leading-relaxed text-slate-700">{resposta}</p>
      </div>
    </div>
  );
}
