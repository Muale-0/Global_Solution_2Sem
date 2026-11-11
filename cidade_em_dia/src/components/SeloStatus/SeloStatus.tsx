import { infoStatus } from '../../dados/status';
import type { StatusOcorrencia } from '../../types/ocorrencia';

type SeloStatusProps = {
  status: StatusOcorrencia;
};

// Etiqueta colorida com o nome do status. O texto sempre aparece,
// então a informação não depende só da cor.
export default function SeloStatus({ status }: SeloStatusProps) {
  const info = infoStatus[status];

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${info.classes}`}
    >
      {info.rotulo}
    </span>
  );
}
