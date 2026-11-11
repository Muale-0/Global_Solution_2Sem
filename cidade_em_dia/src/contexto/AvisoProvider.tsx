import { useEffect, useState, type ReactNode } from 'react';
import type { Aviso } from '../types/site';
import { AvisoContexto } from './AvisoContexto';

// Tempo que o aviso fica na tela, em milissegundos.
const DURACAO = 6000;

export default function AvisoProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);

  // Sempre que um aviso aparece, agenda o sumiço dele.
  // A função devolvida cancela o agendamento se outro aviso chegar antes.
  useEffect(() => {
    if (!aviso) return;
    const temporizador = window.setTimeout(() => setAviso(null), DURACAO);
    return () => window.clearTimeout(temporizador);
  }, [aviso]);

  return (
    <AvisoContexto.Provider
      value={{
        aviso,
        mostrarAviso: setAviso,
        limparAviso: () => setAviso(null),
      }}
    >
      {children}
    </AvisoContexto.Provider>
  );
}
