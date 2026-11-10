/// <reference types="vite/client" />

// Diz ao TypeScript quais variáveis de ambiente existem.
// No Vite, só variáveis que começam com VITE_ chegam ao navegador.
interface ImportMetaEnv {
  /** Endereço base da API Java, sem barra no final. */
  readonly VITE_API_URL?: string;
  /** TEMPORÁRIO: "true" liga os dados de exemplo de src/mocks. */
  readonly VITE_USAR_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
