import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevelarProps = {
  children: ReactNode;
  // Espera (em milissegundos) antes de aparecer. Usado para os cartões
  // de uma mesma linha surgirem um depois do outro.
  atraso?: number;
  className?: string;
};

/**
 * Animação de rolagem: o conteúdo começa invisível e um pouco abaixo,
 * e sobe suavemente quando entra na tela.
 *
 * Usa o IntersectionObserver, recurso do próprio navegador que avisa
 * quando um elemento fica visível. Não precisa de biblioteca.
 */
export default function Revelar({ children, atraso = 0, className = '' }: RevelarProps) {
  // useRef guarda a referência ao <div> real da página.
  const elemento = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = elemento.current;
    if (!alvo) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          // Depois de aparecer uma vez, não precisa mais observar.
          observador.disconnect();
        }
      },
      // Dispara quando 10% do elemento já está na tela.
      { threshold: 0.1 },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={elemento}
      style={{ transitionDelay: `${atraso}ms` }}
      className={`transition-all duration-700 ease-out ${
        visivel ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
