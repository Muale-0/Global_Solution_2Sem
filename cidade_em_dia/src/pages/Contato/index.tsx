import { useForm } from 'react-hook-form';
import { Botao } from '../../components/Botao/Botao';
import CampoFormulario from '../../components/CampoFormulario/CampoFormulario';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import Cartao from '../../components/Cartao/Cartao';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { useAviso } from '../../contexto/AvisoContexto';
import { emailContato, integrantes } from '../../dados/integrantes';
import type { DadosContato } from '../../types/site';
import { padraoEmail } from '../../utils/validacao';

const assuntos = ['Dúvida', 'Sugestão', 'Problema no site', 'Outro'];

export default function Contato() {
  const { mostrarAviso } = useAviso();

  // useForm cuida dos valores, da validação e dos erros do formulário.
  // mode "onTouched": o erro aparece quando a pessoa sai do campo.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DadosContato>({
    mode: 'onTouched',
    defaultValues: { nome: '', email: '', assunto: assuntos[0], mensagem: '' },
  });

  // Só é chamada se todos os campos passarem na validação.
  function enviar(dados: DadosContato) {
    // A API do projeto não tem rota de contato, então o formulário monta
    // um e-mail pronto e abre o aplicativo de e-mail da pessoa.
    // encodeURIComponent troca espaços e acentos por códigos aceitos em links.
    const assunto = encodeURIComponent(`[Cidade em Dia] ${dados.assunto}`);
    const corpo = encodeURIComponent(
      `${dados.mensagem.trim()}\n\n${dados.nome.trim()}\n${dados.email.trim()}`,
    );
    window.location.assign(`mailto:${emailContato}?subject=${assunto}&body=${corpo}`);

    mostrarAviso({
      tipo: 'sucesso',
      mensagem: 'Abrimos seu aplicativo de e-mail com a mensagem pronta. É só enviar.',
    });
    reset();
  }

  return (
    <>
      <TituloPagina
        sobretitulo="Contato"
        titulo="Fale com a equipe"
        descricao="Dúvidas, sugestões ou problemas no site: escreva para a gente."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* noValidate desliga os balões do navegador: quem valida é o react-hook-form. */}
        <form
          noValidate
          onSubmit={handleSubmit(enviar)}
          className="space-y-5 rounded-2xl border border-slate-200 bg-superficie p-5 shadow-sm md:p-6 lg:col-span-2"
        >
          <p className="text-sm text-slate-600">Todos os campos são obrigatórios.</p>

          <div className="grid gap-5 md:grid-cols-2">
            <CampoFormulario id="nome" rotulo="Nome" erro={errors.nome?.message}>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                maxLength={100}
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? 'nome-erro' : undefined}
                className={estiloCampo}
                {...register('nome', {
                  required: 'Informe seu nome.',
                  validate: (valor) =>
                    valor.trim().length >= 3 || 'Digite pelo menos 3 letras.',
                })}
              />
            </CampoFormulario>

            <CampoFormulario id="email" rotulo="E-mail" erro={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={120}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-erro' : undefined}
                className={estiloCampo}
                placeholder="voce@email.com"
                {...register('email', {
                  required: 'Informe seu e-mail.',
                  pattern: { value: padraoEmail, message: 'Digite um e-mail válido.' },
                })}
              />
            </CampoFormulario>
          </div>

          <CampoFormulario id="assunto" rotulo="Assunto" erro={errors.assunto?.message}>
            <select
              id="assunto"
              aria-invalid={!!errors.assunto}
              className={estiloCampo}
              {...register('assunto', { required: 'Escolha um assunto.' })}
            >
              {assuntos.map((assunto) => (
                <option key={assunto} value={assunto}>
                  {assunto}
                </option>
              ))}
            </select>
          </CampoFormulario>

          <CampoFormulario
            id="mensagem"
            rotulo="Mensagem"
            erro={errors.mensagem?.message}
            ajuda="Entre 10 e 1000 caracteres."
          >
            <textarea
              id="mensagem"
              rows={5}
              maxLength={1000}
              aria-invalid={!!errors.mensagem}
              aria-describedby={errors.mensagem ? 'mensagem-erro' : 'mensagem-ajuda'}
              className={estiloCampo}
              {...register('mensagem', {
                required: 'Escreva sua mensagem.',
                validate: (valor) =>
                  valor.trim().length >= 10 || 'Escreva pelo menos 10 caracteres.',
              })}
            />
          </CampoFormulario>

          <Botao type="submit">Enviar mensagem</Botao>
        </form>

        <Cartao className="self-start">
          <h2 className="text-xl font-bold">E-mails da equipe</h2>
          <ul className="mt-4 space-y-4">
            {integrantes.map((integrante) => (
              <li key={integrante.rm}>
                <p className="font-semibold break-words">{integrante.nome}</p>
                <a
                  href={`mailto:rm${integrante.rm}@fiap.com.br`}
                  className="text-sm break-all text-marca-700 underline underline-offset-4 hover:text-marca-900"
                >
                  rm{integrante.rm}@fiap.com.br
                </a>
              </li>
            ))}
          </ul>
        </Cartao>
      </div>
    </>
  );
}
