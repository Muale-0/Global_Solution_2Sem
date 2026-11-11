import { createContext, useContext } from 'react';
import type { Aviso } from '../types/site';

// Contexto dos avisos: qualquer página pode pedir para mostrar uma
// mensagem de sucesso ou erro que aparece no canto da tela.
export interface AvisoContextoValor {
  aviso: Aviso | null;
  mostrarAviso: (aviso: Aviso) => void;
  limparAviso: () => void;
}

export const AvisoContexto = createContext<AvisoContextoValor | null>(null);

export function useAviso() {
  const contexto = useContext(AvisoContexto);
  if (!contexto) {
    throw new Error('useAviso precisa estar dentro de <AvisoProvider>.');
  }
  return contexto;
}
