// Morador como a API devolve. A senha nunca volta na resposta.
export interface Morador {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  subprefeitura: string;
  dataCadastro: string;
}

// Corpo enviado em POST /moradores.
export interface MoradorPayload {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  subprefeitura: string;
  senha: string;
}

// Corpo enviado em POST /moradores/login.
export interface LoginPayload {
  email: string;
  senha: string;
}

// O que guardamos no navegador depois do login: só o necessário.
// CPF, e-mail e telefone ficam de fora de propósito.
export type MoradorSessao = Pick<Morador, 'id' | 'nome'>;
