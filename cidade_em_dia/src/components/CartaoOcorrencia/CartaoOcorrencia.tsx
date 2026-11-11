import { Link } from 'react-router-dom';
import type { Ocorrencia } from '../../types/ocorrencia';
import { formatarData, plural } from '../../utils/formatacao';
import Cartao from '../Cartao/Cartao';
import SeloStatus from '../SeloStatus/SeloStatus';

type CartaoOcorrenciaProps = {
  ocorrencia: Ocorrencia;
  // Para onde o link "Ver detalhes" leva. A lista pública e o painel
  // da gestão usam o mesmo cartão, mas com destinos diferentes.
  destino: string;
  rotuloLink?: string;
  // Só o painel da gestão mostra as coordenadas exatas.
  mostrarCoordenadas?: boolean;
};

export default function CartaoOcorrencia({
  ocorrencia,
  destino,
  rotuloLink = 'Ver detalhes',
  mostrarCoordenadas = false,
}: CartaoOcorrenciaProps) {
  return (
    <Cartao className="flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SeloStatus status={ocorrencia.status} />
        <span className="text-sm font-semibold text-slate-600">
          {ocorrencia.categoriaNome}
        </span>
      </div>

      <h2 className="mt-3 text-lg font-bold break-words">{ocorrencia.titulo}</h2>
      <p className="mt-1 text-sm break-words text-slate-600">
        {ocorrencia.endereco || 'Endereço não informado'}
      </p>
      {mostrarCoordenadas && (
        <p className="mt-1 text-xs text-slate-500">
          Lat {ocorrencia.latitude.toFixed(5)} · Long {ocorrencia.longitude.toFixed(5)}
        </p>
      )}

      {/* dl/dt/dd é a lista de "nome e valor" do HTML.
          mt-auto empurra este bloco para o fim do cartão, então os números
          ficam alinhados mesmo quando um título ocupa duas linhas. */}
      <dl className="mt-auto grid grid-cols-3 gap-2 pt-4 text-center text-sm">
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-600">Aberta em</dt>
          <dd className="font-semibold">{formatarData(ocorrencia.dataAbertura)}</dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-600">Em aberto</dt>
          <dd className="font-semibold">
            {plural(ocorrencia.diasEmAberto, 'dia', 'dias')}
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <dt className="text-xs text-slate-600">Confirmações</dt>
          <dd className="font-semibold">{ocorrencia.totalConfirmacoes}</dd>
        </div>
      </dl>

      <Link
        to={destino}
        aria-label={`${rotuloLink}: ${ocorrencia.titulo}`}
        className="mt-4 inline-block self-start font-semibold text-marca-700 underline underline-offset-4 hover:text-marca-900"
      >
        {rotuloLink}
      </Link>
    </Cartao>
  );
}
