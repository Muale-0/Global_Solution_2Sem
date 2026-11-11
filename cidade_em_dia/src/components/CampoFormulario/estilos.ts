// Classes compartilhadas por todos os inputs, selects e textareas.
// text-base (16px) evita que o iPhone dê zoom ao focar o campo.
// aria-invalid:... pinta a borda de vermelho quando o campo tem erro.
export const estiloCampo =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-marca-600 focus:ring-2 focus:ring-marca-600/25 aria-invalid:border-rose-600 disabled:bg-slate-100';
