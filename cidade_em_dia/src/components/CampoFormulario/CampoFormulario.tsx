import type { ReactNode } from 'react';

type CampoFormularioProps = {
  // Mesmo id do input/select que vai dentro, para o label apontar para ele.
  id: string;
  rotulo: string;
  erro?: string;
  ajuda?: string;
  children: ReactNode;
};

// Junta rótulo, campo, texto de ajuda e mensagem de erro em um bloco só.
// O campo em si (input, select, textarea) vem como "children".
export default function CampoFormulario({
  id,
  rotulo,
  erro,
  ajuda,
  children,
}: CampoFormularioProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {rotulo}
      </label>
      {children}
      {ajuda && !erro && (
        <p id={`${id}-ajuda`} className="mt-1.5 text-sm text-slate-600">
          {ajuda}
        </p>
      )}
      {erro && (
        <p
          id={`${id}-erro`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-rose-700"
        >
          {erro}
        </p>
      )}
    </div>
  );
}
