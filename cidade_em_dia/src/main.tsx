import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import AvisoProvider from './contexto/AvisoProvider';
import SessaoProvider from './contexto/SessaoProvider';
import TemaProvider from './contexto/TemaProvider';
import Cadastro from './pages/Cadastro/index';
import Contato from './pages/Contato/index';
import DetalheOcorrencia from './pages/DetalheOcorrencia/index';
import Entrar from './pages/Entrar/index';
import Faq from './pages/Faq/index';
import Gestao from './pages/Gestao/index';
import GestaoOcorrencia from './pages/GestaoOcorrencia/index';
import Home from './pages/Home/index';
import Integrantes from './pages/Integrantes/index';
import NaoEncontrada from './pages/NaoEncontrada/index';
import NovaOcorrencia from './pages/NovaOcorrencia/index';
import Ocorrencias from './pages/Ocorrencias/index';
import Sobre from './pages/Sobre/index';
import './css/main.css';

// Mapa de rotas da aplicação: cada endereço aponta para uma página.
// Todas são "filhas" de App, então aparecem dentro do <Outlet /> dele.
const roteador = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Páginas institucionais
      { index: true, element: <Home /> },
      { path: 'integrantes', element: <Integrantes /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contato', element: <Contato /> },

      // Páginas da solução (morador)
      { path: 'ocorrencias', element: <Ocorrencias /> },
      { path: 'ocorrencias/nova', element: <NovaOcorrencia /> },
      // ":id" é um parâmetro: /ocorrencias/7 abre a ocorrência de id 7.
      { path: 'ocorrencias/:id', element: <DetalheOcorrencia /> },
      // Editar usa a mesma página do registro: com ":id" ela entra em modo edição.
      // A key diferente faz o React montar a página do zero ao trocar de rota.
      { path: 'ocorrencias/:id/editar', element: <NovaOcorrencia key="editar" /> },
      { path: 'entrar', element: <Entrar /> },
      { path: 'cadastro', element: <Cadastro /> },

      // Páginas da solução (gestão pública)
      { path: 'gestao', element: <Gestao /> },
      { path: 'gestao/ocorrencias/:id', element: <GestaoOcorrencia /> },

      // Qualquer endereço que não existe cai aqui.
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Os providers ficam por fora para toda página enxergar tema, sessão e avisos. */}
    <TemaProvider>
      <SessaoProvider>
        <AvisoProvider>
          <RouterProvider router={roteador} />
        </AvisoProvider>
      </SessaoProvider>
    </TemaProvider>
  </StrictMode>,
);
