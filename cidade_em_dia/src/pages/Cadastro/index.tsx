import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Botao } from '../../components/Botao/Botao';
import CampoFormulario from '../../components/CampoFormulario/CampoFormulario';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { useAviso } from '../../contexto/AvisoContexto';
import { useSessao } from '../../contexto/SessaoContexto';
import { subprefeituras } from '../../dados/subprefeituras';
import { mensagemDeErro } from '../../services/api';
import { cadastrarMorador } from '../../services/moradorService';
import type { MoradorPayload } from '../../types/morador';
import { marcarCamposInvalidos } from '../../utils/errosFormulario';
import { apenasDigitos, cpfValido, padraoEmail } from '../../utils/validacao';

// O formulário tem um campo a mais que a API: a repetição da senha.
interface FormularioCadastro extends MoradorPayload {
  confirmarSenha: string;
}

export default function Cadastro() {
  const { entrar } = useSessao();
  const { mostrarAviso } = useAviso();
  const navegar = useNavigate();

  const [parametros] = useSearchParams();
  const voltar = parametros.get('voltar') ?? '';
  const destino = voltar.startsWith('/') && !voltar.startsWith('//') ? voltar : '/ocorrencias';

  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormularioCadastro>({
    mode: 'onTouched',
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      subprefeitura: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  async function enviar(dados: FormularioCadastro) {
    setEnviando(true);
    setErroGeral('');
    try {
      // confirmarSenha fica de fora: a API não conhece esse campo.
      const criado = await cadastrarMorador({
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        // A API recebe CPF e telefone só com números.
        cpf: apenasDigitos(dados.cpf),
        telefone: apenasDigitos(dados.telefone),
        subprefeitura: dados.subprefeitura,
        senha: dados.senha,
      });

      if (criado) {
        // A API devolveu o morador criado: já deixa a pessoa conectada.
        entrar(criado);
        mostrarAviso({ tipo: 'sucesso', mensagem: 'Conta criada. Boas-vindas!' });
        navegar(destino, { replace: true });
      } else {
        mostrarAviso({
          tipo: 'sucesso',
          mensagem: 'Conta criada. Entre com seu e-mail e senha.',
        });
        navegar('/entrar', { replace: true });
      }
    } catch (erro) {
      const marcou = marcarCamposInvalidos<FormularioCadastro>(
        erro,
        ['nome', 'email', 'cpf', 'telefone', 'subprefeitura', 'senha'],
        setError,
      );
      // 409 (e-mail ou CPF já cadastrado) cai aqui com a mensagem da API.
      setErroGeral(
        marcou ? 'Corrija os campos destacados e envie de novo.' : mensagemDeErro(erro),
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <TituloPagina
        sobretitulo="Conta"
        titulo="Criar conta"
        descricao="O cadastro é gratuito. Todos os campos são obrigatórios."
      />

      <form
        noValidate
        onSubmit={handleSubmit(enviar)}
        className="rounded-2xl border border-slate-200 bg-superficie p-5 shadow-sm md:p-8"
      >
        <fieldset disabled={enviando} className="min-w-0 space-y-5">
          <legend className="sr-only">Dados do morador</legend>

          <CampoFormulario id="nome" rotulo="Nome completo" erro={errors.nome?.message}>
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
              {...register('email', {
                required: 'Informe seu e-mail.',
                pattern: { value: padraoEmail, message: 'Digite um e-mail válido.' },
              })}
            />
          </CampoFormulario>

          <div className="grid gap-5 md:grid-cols-2">
            <CampoFormulario id="cpf" rotulo="CPF" erro={errors.cpf?.message}>
              <input
                id="cpf"
                type="text"
                inputMode="numeric"
                maxLength={14}
                aria-invalid={!!errors.cpf}
                aria-describedby={errors.cpf ? 'cpf-erro' : undefined}
                className={estiloCampo}
                placeholder="000.000.000-00"
                {...register('cpf', {
                  required: 'Informe seu CPF.',
                  validate: (valor) => cpfValido(valor) || 'Digite um CPF válido.',
                })}
              />
            </CampoFormulario>

            <CampoFormulario
              id="telefone"
              rotulo="Telefone com DDD"
              erro={errors.telefone?.message}
            >
              <input
                id="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={16}
                aria-invalid={!!errors.telefone}
                aria-describedby={errors.telefone ? 'telefone-erro' : undefined}
                className={estiloCampo}
                placeholder="(11) 98765-4321"
                {...register('telefone', {
                  required: 'Informe seu telefone.',
                  validate: (valor) => {
                    const quantidade = apenasDigitos(valor).length;
                    return (
                      quantidade === 10 ||
                      quantidade === 11 ||
                      'Digite o DDD e o número (10 ou 11 dígitos).'
                    );
                  },
                })}
              />
            </CampoFormulario>
          </div>

          <CampoFormulario
            id="subprefeitura"
            rotulo="Subprefeitura de referência"
            erro={errors.subprefeitura?.message}
            ajuda="Só a região aproximada. Não pedimos seu endereço."
          >
            <select
              id="subprefeitura"
              aria-invalid={!!errors.subprefeitura}
              aria-describedby={
                errors.subprefeitura ? 'subprefeitura-erro' : 'subprefeitura-ajuda'
              }
              className={estiloCampo}
              {...register('subprefeitura', { required: 'Escolha uma subprefeitura.' })}
            >
              <option value="">Selecione...</option>
              {subprefeituras.map((subprefeitura) => (
                <option key={subprefeitura} value={subprefeitura}>
                  {subprefeitura}
                </option>
              ))}
            </select>
          </CampoFormulario>

          <div className="grid gap-5 md:grid-cols-2">
            <CampoFormulario
              id="senha"
              rotulo="Senha"
              erro={errors.senha?.message}
              ajuda="De 6 a 60 caracteres."
            >
              <input
                id="senha"
                type="password"
                autoComplete="new-password"
                maxLength={60}
                aria-invalid={!!errors.senha}
                aria-describedby={errors.senha ? 'senha-erro' : 'senha-ajuda'}
                className={estiloCampo}
                {...register('senha', {
                  required: 'Crie uma senha.',
                  minLength: { value: 6, message: 'A senha precisa de pelo menos 6 caracteres.' },
                })}
              />
            </CampoFormulario>

            <CampoFormulario
              id="confirmarSenha"
              rotulo="Repita a senha"
              erro={errors.confirmarSenha?.message}
            >
              <input
                id="confirmarSenha"
                type="password"
                autoComplete="new-password"
                maxLength={60}
                aria-invalid={!!errors.confirmarSenha}
                aria-describedby={errors.confirmarSenha ? 'confirmarSenha-erro' : undefined}
                className={estiloCampo}
                {...register('confirmarSenha', {
                  required: 'Repita a senha.',
                  // O segundo parâmetro traz os outros valores do formulário.
                  validate: (valor, valores) =>
                    valor === valores.senha || 'As senhas não são iguais.',
                })}
              />
            </CampoFormulario>
          </div>

          {erroGeral && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 font-medium text-rose-900"
            >
              {erroGeral}
            </p>
          )}

          <Botao type="submit" className="w-full sm:w-auto">
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </Botao>
        </fieldset>
      </form>

      <p className="mt-5 text-center text-slate-700">
        Já tem conta?{' '}
        <Link
          to="/entrar"
          className="font-semibold text-marca-700 underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
