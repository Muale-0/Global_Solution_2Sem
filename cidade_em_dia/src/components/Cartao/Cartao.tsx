import type { ReactNode } from 'react';

type CartaoProps = {
  children: ReactNode;
  className?: string;
};

// Caixa de superfície com borda e sombra leve, usada em quase todas as páginas.
export default function Cartao({ children, className = '' }: CartaoProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-superficie p-5 shadow-sm transition-shadow duration-300 md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
