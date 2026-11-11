// Tipos do conteúdo fixo do site (não vêm da API).

export interface Integrante {
  nome: string;
  rm: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
}

export interface ItemFaq {
  pergunta: string;
  resposta: string;
}

export interface GrupoFaq {
  titulo: string;
  itens: ItemFaq[];
}

export type TipoAviso = 'sucesso' | 'erro' | 'info';

// Mensagem curta que aparece no canto da tela depois de uma ação.
export interface Aviso {
  tipo: TipoAviso;
  mensagem: string;
}

// Campos do formulário de contato.
export interface DadosContato {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}
