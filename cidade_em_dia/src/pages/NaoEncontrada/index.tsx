import { LinkBotao } from '../../components/Botao/Botao';

// Aparece quando o endereço digitado não corresponde a nenhuma rota.
export default function NaoEncontrada() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="text-sm font-bold tracking-widest text-marca-700 uppercase">
        Erro 404
      </p>
      <h1 className="mt-2 text-3xl font-bold md:text-4xl">Página não encontrada</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        O endereço que você abriu não existe ou mudou de lugar.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <LinkBotao to="/">Voltar ao início</LinkBotao>
        <LinkBotao to="/ocorrencias" variante="secundario">
          Ver ocorrências
        </LinkBotao>
      </div>
    </div>
  );
}
