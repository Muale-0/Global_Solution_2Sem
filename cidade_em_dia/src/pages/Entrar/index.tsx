import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Botao, LinkBotao } from '../../components/Botao/Botao';
import CampoFormulario from '../../components/CampoFormulario/CampoFormulario';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import Cartao from '../../components/Cartao/Cartao';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { useAviso } from '../../contexto/AvisoContexto';
import { useSessao } from '../../contexto/SessaoContexto';
import { mensagemDeErro } from '../../services/api';
import { fazerLogin } from '../../services/moradorService';
import type { LoginPayload } from '../../types/morador';
import { primeiroNome } from '../../utils/formatacao';
import { padraoEmail } from '../../utils/validacao';

export default function Entrar() {
  const { morador, entrar, sair } = useSessao();
  const { mostrarAviso } = useAviso();
  const navegar = useNavigate();

  // Lê o "?voltar=..." do endereço: a página para onde ir depois do login.
  // Só aceita caminhos internos (que começam com uma barra só), para o
  // link não poder ser usado para mandar a pessoa a outro site.
  const [parametros] = useSearchParams();
  const voltar = parametros.get('voltar') ?? '';
  const caminhoInterno = voltar.startsWith('/') && !voltar.startsWith('//');
  const destino = caminhoInterno ? voltar : '/ocorrencias';

  const [enviando, setEnviando] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    mode: 'onTouched',
    defaultValues: { email: '', senha: '' },
  });

  async function enviar(dados: LoginPayload) {
    setEnviando(true);
    setErroLogin('');
    try {
      const moradorLogado = await fazerLogin({
        email: dados.email.trim(),
        senha: dados.senha,
      });
      entrar(moradorLogado);
      mostrarAviso({
        tipo: 'sucesso',
        mensagem: `Olá, ${primeiroNome(moradorLogado.nome)}! Você entrou na sua conta.`,
      });
      // replace: o botão "voltar" do navegador não retorna para o login.
      navegar(destino, { replace: true });
    } catch (erro) {
      // Em caso de 401 a API manda "E-mail ou senha inválidos."
      setErroLogin(mensagemDeErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  // Quem já está logado vê um resumo em vez do formulário.
  if (morador) {
    return (
      <div className="mx-auto max-w-md">
        <TituloPagina sobretitulo="Conta" titulo="Você já está conectado" />
        <Cartao>
          <p className="text-slate-700">
            Conectado como <strong>{morador.nome}</strong>.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <LinkBotao to="/ocorrencias">Ver ocorrências</LinkBotao>
            <Botao variante="secundario" onClick={sair}>
              Sair da conta
            </Botao>
          </div>
        </Cartao>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <TituloPagina
        sobretitulo="Conta"
        titulo="Entrar"
        descricao="Acesse sua conta para registrar e confirmar ocorrências."
      />

      <form
        noValidate
        onSubmit={handleSubmit(enviar)}
        className="rounded-2xl border border-slate-200 bg-superficie p-5 shadow-sm md:p-6"
      >
        <fieldset disabled={enviando} className="min-w-0 space-y-5">
          <legend className="sr-only">Dados de acesso</legend>

          <CampoFormulario id="email" rotulo="E-mail" erro={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-erro' : undefined}
              className={estiloCampo}
              {...register('email', {
                required: 'Informe seu e-mail.',
                pattern: { value: padraoEmail, message: 'Digite um e-mail válido.' },
              })}
            />
          </CampoFormulario>

          <CampoFormulario id="senha" rotulo="Senha" erro={errors.senha?.message}>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!errors.senha}
              aria-describedby={errors.senha ? 'senha-erro' : undefined}
              className={estiloCampo}
              {...register('senha', { required: 'Informe sua senha.' })}
            />
          </CampoFormulario>

          {erroLogin && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 font-medium text-rose-900"
            >
              {erroLogin}
            </p>
          )}

          <Botao type="submit" className="w-full">
            {enviando ? 'Entrando...' : 'Entrar'}
          </Botao>
        </fieldset>
      </form>

      <p className="mt-5 text-center text-slate-700">
        Ainda não tem conta?{' '}
        <Link
          // Leva o "voltar" junto, para o cadastro também saber o destino.
          to={caminhoInterno ? `/cadastro?voltar=${encodeURIComponent(voltar)}` : '/cadastro'}
          className="font-semibold text-marca-700 underline underline-offset-4"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
