import { useEffect, useState } from 'react';

/**
 * Hook próprio: devolve quanto da página já foi rolado, de 0 (topo) a 1 (fim).
 * É usado pela barrinha amarela do cabeçalho.
 */
export function useProgressoRolagem() {
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    function calcular() {
      const pagina = document.documentElement;
      // Altura que ainda dá para rolar = altura total - altura da janela.
      const rolavel = pagina.scrollHeight - pagina.clientHeight;
      setProgresso(rolavel > 0 ? Math.min(1, window.scrollY / rolavel) : 0);
    }

    calcular();
    // passive: avisa o navegador que o evento não vai travar a rolagem.
    window.addEventListener('scroll', calcular, { passive: true });
    window.addEventListener('resize', calcular);

    // Ao sair da tela, o componente para de escutar os eventos.
    return () => {
      window.removeEventListener('scroll', calcular);
      window.removeEventListener('resize', calcular);
    };
  }, []);

  return progresso;
}
