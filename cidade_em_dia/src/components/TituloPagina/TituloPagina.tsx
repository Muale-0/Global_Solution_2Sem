type TituloPaginaProps = {
  titulo: string;
  descricao?: string;
  // Texto pequeno acima do título, para situar a pessoa (ex.: "GESTÃO").
  sobretitulo?: string;
};

// Cabeçalho padrão de cada página. Garante um único <h1> por página.
// animate-surgir faz o bloco subir suavemente quando a página abre.
export default function TituloPagina({
  titulo,
  descricao,
  sobretitulo,
}: TituloPaginaProps) {
  return (
    <header className="mb-8 animate-surgir">
      {sobretitulo && (
        <p className="flex items-center gap-2 text-sm font-bold tracking-widest text-marca-700 uppercase">
          {/* Tracinho amarelo, marca visual do site. */}
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-destaque-400" />
          {sobretitulo}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold text-balance break-words md:text-4xl">
        {titulo}
      </h1>
      {descricao && (
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
          {descricao}
        </p>
      )}
    </header>
  );
}
