import { useState, type ReactNode } from 'react';
import type { Morador, MoradorSessao } from '../types/morador';
import { SessaoContexto } from './SessaoContexto';

// Nome da "gaveta" do localStorage onde a sessão fica guardada.
const CHAVE = 'cidade-em-dia:morador';

// Lê a sessão salva. O try/catch evita quebrar a página se o texto
// guardado estiver corrompido.
function lerSessaoSalva(): MoradorSessao | null {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? (JSON.parse(texto) as MoradorSessao) : null;
  } catch {
    return null;
  }
}

export default function SessaoProvider({ children }: { children: ReactNode }) {
  // Passar a função (sem parênteses) faz o React ler o localStorage
  // só na primeira vez, e não a cada renderização.
  const [morador, setMorador] = useState<MoradorSessao | null>(lerSessaoSalva);

  function entrar(moradorLogado: Morador) {
    // Guarda só id e nome. CPF, e-mail e telefone não ficam no navegador.
    const sessao: MoradorSessao = { id: moradorLogado.id, nome: moradorLogado.nome };
    localStorage.setItem(CHAVE, JSON.stringify(sessao));
    setMorador(sessao);
  }

  function sair() {
    localStorage.removeItem(CHAVE);
    setMorador(null);
  }

  return (
    <SessaoContexto.Provider value={{ morador, entrar, sair }}>
      {children}
    </SessaoContexto.Provider>
  );
}
