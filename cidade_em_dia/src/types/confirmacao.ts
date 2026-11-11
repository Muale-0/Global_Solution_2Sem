// Confirmação de outro morador de que o problema existe, como a API devolve.
export interface Confirmacao {
  id: number;
  ocorrenciaId: number;
  moradorId: number;
  moradorNome: string;
  comentario: string | null;
  dataConfirmacao: string;
}

// Corpo enviado em POST /ocorrencias/{id}/confirmacoes.
export interface ConfirmacaoPayload {
  moradorId: number;
  comentario?: string;
}
