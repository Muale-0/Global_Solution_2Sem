import type { ReactNode } from 'react';
import { Botao } from '../Botao/Botao';

// Três componentes para os três momentos de uma busca na API:
// carregando, erro e lista vazia.

type CarregandoProps = {
  texto?: string;
};

export function Carregando({ texto = 'Carregando dados...' }: CarregandoProps) {
  return (
    // role="status" faz o leitor de tela anunciar o carregamento.
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-superficie p-10 text-center"
    >
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-marca-100 border-t-marca-700"
      />
      <p className="font-semibold text-slate-700">{texto}</p>
    </div>
  );
}

type MensagemErroProps = {
  mensagem: string;
  aoTentarNovamente?: () => void;
};

export function MensagemErro({ mensagem, aoTentarNovamente }: MensagemErroProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
    >
      <h2 className="text-xl font-bold text-rose-900">Algo deu errado</h2>
      <p className="max-w-md leading-relaxed text-rose-900">{mensagem}</p>
      {aoTentarNovamente && (
        <Botao variante="secundario" onClick={aoTentarNovamente}>
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}

type SemDadosProps = {
  titulo: string;
  texto: string;
  // Espaço para um botão de ação, se fizer sentido.
  children?: ReactNode;
};

export function SemDados({ titulo, texto, children }: SemDadosProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-superficie p-8 text-center">
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p className="max-w-md leading-relaxed text-slate-600">{texto}</p>
      {children}
    </div>
  );
}
