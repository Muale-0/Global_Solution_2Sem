// Um campo recusado pela validação da API (aparece só no erro 400).
export interface CampoInvalido {
  campo: string;
  mensagem: string;
}

// Formato de erro padronizado da API Java.
export interface RespostaErro {
  status: number;
  erro: string;
  mensagem: string;
  caminho: string;
  timestamp: string;
  campos?: CampoInvalido[];
  // Vem só no 409 de ocorrência duplicada.
  ocorrenciaExistenteId?: number;
}

// Os três momentos de uma busca de dados.
// É uma "união discriminada": o campo status diz qual formato o objeto tem,
// então o TypeScript só deixa ler "dados" quando status é "sucesso".
export type EstadoRequisicao<T> =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'sucesso'; dados: T };
