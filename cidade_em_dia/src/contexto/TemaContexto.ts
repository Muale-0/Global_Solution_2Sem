import { createContext, useContext } from 'react';

export type Tema = 'claro' | 'escuro';

// Contexto do tema: qualquer componente pode saber se o site está no
// modo claro ou escuro e pedir para trocar.
export interface TemaContextoValor {
  tema: Tema;
  alternarTema: () => void;
}

export const TemaContexto = createContext<TemaContextoValor | null>(null);

export function useTema() {
  const contexto = useContext(TemaContexto);
  if (!contexto) {
    throw new Error('useTema precisa estar dentro de <TemaProvider>.');
  }
  return contexto;
}
