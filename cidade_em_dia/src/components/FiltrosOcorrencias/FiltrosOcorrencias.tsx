import { infoStatus, listaStatus } from '../../dados/status';
import type { Categoria } from '../../types/categoria';
import type { FiltrosOcorrencia, StatusOcorrencia } from '../../types/ocorrencia';
import { estiloCampo } from '../CampoFormulario/estilos';

type FiltrosOcorrenciasProps = {
  filtros: FiltrosOcorrencia;
  categorias: Categoria[];
  // A página "dona" dos filtros recebe o novo valor e decide o que fazer.
  aoMudar: (filtros: FiltrosOcorrencia) => void;
};

// Componente "controlado": ele não guarda estado próprio.
// Mostra os filtros que recebe e avisa a página quando algo muda.
export default function FiltrosOcorrencias({
  filtros,
  categorias,
  aoMudar,
}: FiltrosOcorrenciasProps) {
  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-200 bg-superficie p-4 sm:grid-cols-2 md:p-5"
      onSubmit={(evento) => evento.preventDefault()}
    >
      <div>
        <label htmlFor="filtro-status" className="mb-1.5 block text-sm font-semibold">
          Status
        </label>
        <select
          id="filtro-status"
          className={estiloCampo}
          value={filtros.status ?? ''}
          onChange={(evento) =>
            aoMudar({
              ...filtros,
              // Valor vazio significa "sem filtro".
              status: (evento.target.value || undefined) as StatusOcorrencia | undefined,
            })
          }
        >
          <option value="">Todos os status</option>
          {listaStatus.map((status) => (
            <option key={status} value={status}>
              {infoStatus[status].rotulo}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filtro-categoria" className="mb-1.5 block text-sm font-semibold">
          Categoria
        </label>
        <select
          id="filtro-categoria"
          className={estiloCampo}
          value={filtros.categoriaId ?? ''}
          onChange={(evento) =>
            aoMudar({
              ...filtros,
              categoriaId: Number(evento.target.value) || undefined,
            })
          }
        >
          <option value="">Todas as categorias</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
