/// <reference types="vite/client" />

// Diz ao TypeScript quais variáveis de ambiente existem.
// No Vite, só variáveis que começam com VITE_ chegam ao navegador.
interface ImportMetaEnv {
  /** Endereço base da API Java, sem barra no final. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
