import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ErroApi } from '../services/api';

/**
 * Quando a API responde 400, ela manda a lista "campos" dizendo o que está
 * errado em cada um. Esta função pega essa lista e marca o erro no campo
 * correspondente do formulário, para a mensagem aparecer ao lado dele.
 *
 * É genérica (<T>) para servir a qualquer formulário do projeto.
 * Devolve true se pelo menos um campo foi marcado.
 */
export function marcarCamposInvalidos<T extends FieldValues>(
  erro: unknown,
  camposDoFormulario: Path<T>[],
  setError: UseFormSetError<T>,
) {
  if (!(erro instanceof ErroApi)) return false;

  let marcou = false;
  for (const invalido of erro.campos) {
    // Só marca se o nome que veio da API existir neste formulário.
    const campo = camposDoFormulario.find((nome) => nome === invalido.campo);
    if (campo) {
      setError(campo, { type: 'server', message: invalido.mensagem });
      marcou = true;
    }
  }
  return marcou;
}
