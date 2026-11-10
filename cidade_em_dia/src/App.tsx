import { Outlet, ScrollRestoration } from 'react-router-dom';
import AvisoFlutuante from './components/AvisoFlutuante/AvisoFlutuante';
import Cabecalho from './components/Cabecalho/Cabecalho';
import Rodape from './components/Rodape/Rodape';

// App é a "moldura" de todas as páginas: cabeçalho em cima, rodapé embaixo.
// O <Outlet /> é o espaço onde o roteador encaixa a página da rota atual.
export default function App() {
  return (
    // transition-colors: a troca entre modo claro e escuro acontece suavemente.
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-300">
      {/* Link invisível que aparece ao apertar Tab: leva quem navega pelo
          teclado direto ao conteúdo, sem passar pelo menu inteiro. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-acao focus:px-4 focus:py-2 focus:font-semibold focus:text-sobre-acao focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <Cabecalho />

      <main
        id="conteudo"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none md:px-6 md:py-12"
      >
        <Outlet />
      </main>

      <Rodape />
      <AvisoFlutuante />

      {/* Ao trocar de página, volta a rolagem para o topo. */}
      <ScrollRestoration />
    </div>
  );
}
