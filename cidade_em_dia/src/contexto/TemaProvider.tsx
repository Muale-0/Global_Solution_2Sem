import { useEffect, useState, type ReactNode } from 'react';
import { TemaContexto, type Tema } from './TemaContexto';

// Mesma chave usada pelo script do index.html.
const CHAVE = 'cidade-em-dia:tema';

// O script do index.html já colocou (ou não) a classe "dark" no <html>
// antes de o React começar. Aqui só lemos o que ele decidiu.
function lerTemaInicial(): Tema {
  return document.documentElement.classList.contains('dark') ? 'escuro' : 'claro';
}

export default function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(lerTemaInicial);

  // Sempre que o tema muda, põe ou tira a classe "dark" do <html>.
  // É essa classe que ativa as cores do bloco .dark no main.css.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'escuro');
  }, [tema]);

  function alternarTema() {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro';
    setTema(novo);
    try {
      // Guarda a escolha para a próxima visita.
      localStorage.setItem(CHAVE, novo);
    } catch {
      // Sem localStorage a troca vale só para esta visita.
    }
  }

  return (
    <TemaContexto.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContexto.Provider>
  );
}
