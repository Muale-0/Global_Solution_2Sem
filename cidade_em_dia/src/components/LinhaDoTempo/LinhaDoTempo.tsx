import type { Atualizacao } from '../../types/atualizacao';
import { formatarDataHora } from '../../utils/formatacao';
import SeloStatus from '../SeloStatus/SeloStatus';

type LinhaDoTempoProps = {
  dataAbertura: string;
  atualizacoes: Atualizacao[];
};

// Histórico da ocorrência: o registro inicial e cada mudança de status.
export default function LinhaDoTempo({ dataAbertura, atualizacoes }: LinhaDoTempoProps) {
  // Copia a lista antes de ordenar, para não alterar a original.
  // Datas no formato ISO podem ser comparadas como texto.
  const emOrdem = [...atualizacoes].sort((a, b) =>
    a.dataAtualizacao.localeCompare(b.dataAtualizacao),
  );

  return (
    <ol className="space-y-5 border-l-2 border-marca-200 pl-5">
      <li>
        <p className="text-sm text-slate-600">{formatarDataHora(dataAbertura)}</p>
        <div className="mt-1">
          <SeloStatus status="REGISTRADA" />
        </div>
        <p className="mt-2 text-slate-700">Ocorrência registrada pelo morador.</p>
      </li>

      {emOrdem.map((atualizacao) => (
        <li key={atualizacao.id}>
          <p className="text-sm text-slate-600">
            {formatarDataHora(atualizacao.dataAtualizacao)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <SeloStatus status={atualizacao.statusAnterior} />
            {/* A seta é só visual; o leitor de tela lê o texto escondido. */}
            <span aria-hidden="true">→</span>
            <span className="sr-only">mudou para</span>
            <SeloStatus status={atualizacao.statusNovo} />
          </div>
          <p className="mt-2 break-words text-slate-700">{atualizacao.descricao}</p>
          <p className="mt-1 text-sm text-slate-600">
            Responsável: {atualizacao.responsavel}
          </p>
          {atualizacao.urlEvidencia && (
            <a
              href={atualizacao.urlEvidencia}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm font-semibold text-marca-700 underline underline-offset-4"
            >
              Ver evidência do serviço (abre em nova aba)
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
