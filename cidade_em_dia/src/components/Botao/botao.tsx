import type { ComponentProps, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variante = 'primario' | 'secundario' | 'destaque' | 'transparente' | 'perigo';

// Classes que todo botão tem, não importa a cor.
// min-h-11 garante 44px de altura, tamanho confortável para tocar no celular.
const estiloBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-center font-semibold transition duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-700 disabled:cursor-not-allowed disabled:opacity-60';

const estiloVariante: Record<Variante, string> = {
  primario: 'bg-acao text-sobre-acao shadow-sm hover:bg-acao-forte hover:shadow-md',
  secundario: 'bg-superficie text-marca-800 ring-1 ring-marca-200 ring-inset hover:bg-marca-50',
  destaque: 'bg-destaque-400 text-black shadow-sm hover:bg-destaque-300 hover:shadow-md',
  // Para usar em cima de faixas escuras (destaque da Home).
  transparente: 'bg-white/10 text-white ring-1 ring-white/30 ring-inset hover:bg-white/20',
  // Vermelho, para ações que não têm volta (excluir).
  // text-slate-50 é claro no modo claro e escuro no modo escuro,
  // acompanhando o vermelho, que fica mais claro no escuro.
  perigo: 'bg-rose-600 text-slate-50 shadow-sm hover:bg-rose-700 hover:shadow-md',
};

function montarClasses(variante: Variante, extras: string) {
  return `${estiloBase} ${estiloVariante[variante]} ${extras}`;
}

// ComponentProps<'button'> traz todas as props de um <button> comum
// (onClick, disabled, aria-label...). Somamos só a nossa: variante.
type BotaoProps = ComponentProps<'button'> & {
  variante?: Variante;
};

export function Botao({
  variante = 'primario',
  className = '',
  type = 'button',
  ...resto
}: BotaoProps) {
  return (
    <button type={type} className={montarClasses(variante, className)} {...resto} />
  );
}

type LinkBotaoProps = {
  to: string;
  children: ReactNode;
  variante?: Variante;
  className?: string;
};

// Mesmo visual do botão, mas é um link que troca de página.
export function LinkBotao({
  to,
  children,
  variante = 'primario',
  className = '',
}: LinkBotaoProps) {
  return (
    <Link to={to} className={montarClasses(variante, className)}>
      {children}
    </Link>
  );
}
