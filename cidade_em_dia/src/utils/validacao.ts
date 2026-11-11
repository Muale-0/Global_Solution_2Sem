// Funções de validação usadas nos formulários, antes de chamar a API.

// "(11) 98765-4321" -> "11987654321"
export function apenasDigitos(valor: string) {
  return valor.replace(/\D/g, '');
}

// Formato simples de e-mail: algo@algo.algo
export const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A API só aceita links que começam com http:// ou https://
export function linkValido(valor: string) {
  return /^https?:\/\/\S+$/i.test(valor.trim());
}

// Confere os dois dígitos verificadores do CPF.
export function cpfValido(valor: string) {
  const cpf = apenasDigitos(valor);

  // Precisa ter 11 dígitos e não pode ser uma sequência repetida (111.111.111-11).
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  // Calcula um dígito verificador a partir dos "tamanho" primeiros dígitos.
  function calcularDigito(tamanho: number) {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10]);
}
