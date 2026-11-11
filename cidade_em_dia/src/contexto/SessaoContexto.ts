import { createContext, useContext } from 'react';
import type { Morador, MoradorSessao } from '../types/morador';

// Contexto é uma forma de compartilhar um dado com a aplicação inteira
// sem passar props de componente em componente.
// Aqui o dado compartilhado é "quem está logado".
export interface SessaoContextoValor {
  morador: MoradorSessao | null;
  entrar: (morador: Morador) => void;
  sair: () => void;
}

export const SessaoContexto = createContext<SessaoContextoValor | null>(null);

// Hook próprio para ler a sessão em qualquer componente.
export function useSessao() {
  const contexto = useContext(SessaoContexto);
  if (!contexto) {
    throw new Error('useSessao precisa estar dentro de <SessaoProvider>.');
  }
  return contexto;
}
