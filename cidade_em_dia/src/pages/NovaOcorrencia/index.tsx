import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Botao, LinkBotao } from '../../components/Botao/Botao';
import CampoFormulario from '../../components/CampoFormulario/CampoFormulario';
import { estiloCampo } from '../../components/CampoFormulario/estilos';
import { Carregando, MensagemErro, SemDados } from '../../components/EstadoApi/EstadoApi';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { useAviso } from '../../contexto/AvisoContexto';
import { useSessao } from '../../contexto/SessaoContexto';
import { ErroApi, mensagemDeErro } from '../../services/api';
import { listarCategorias } from '../../services/categoriaService';
import { confirmarOcorrencia, registrarOcorrencia } from '../../services/ocorrenciaService';
import type { EstadoRequisicao } from '../../types/api';
import type { Categoria } from '../../types/categoria';
import { marcarCamposInvalidos } from '../../utils/errosFormulario';
import { linkValido } from '../../utils/validacao';

// Campos do formulário. Os nomes são os mesmos do corpo que a API espera,
// assim os erros que ela devolve por campo encaixam direto aqui.
interface FormularioOcorrencia {
  categoriaId: number;
  titulo: string;
  descricao: string;
  endereco: string;
  latitude: number;
  longitude: number;
  urlFoto: string;
}

// Dados do aviso de ocorrência duplicada (erro 409 da API).
interface Duplicada {
  id: number;
  mensagem: string;
}

export default function NovaOcorrencia() {
  const { morador } = useSessao();
  const { mostrarAviso } = useAviso();
  const navegar = useNavigate();

  const [categorias, setCategorias] = useState<EstadoRequisicao<Categoria[]>>({
    status: 'carregando',
  });
  const [tentativa, setTentativa] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [duplicada, setDuplicada] = useState<Duplicada | null>(null);
  const [buscandoLocal, setBuscandoLocal] = useState(false);
  const [avisoLocal, setAvisoLocal] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormularioOcorrencia>({
    mode: 'onTouched',
    defaultValues: { titulo: '', descricao: '', endereco: '', urlFoto: '' },
  });

  // Busca as categorias para preencher o campo de escolha.
  useEffect(() => {
    let ativo = true;
    listarCategorias()
      .then((lista) => {
        if (ativo) setCategorias({ status: 'sucesso', dados: lista ?? [] });
      })
      .catch((erro) => {
        if (ativo) setCategorias({ status: 'erro', mensagem: mensagemDeErro(erro) });
      });
    return () => {
      ativo = false;
    };
  }, [tentativa]);

  // Usa a localização do aparelho (função nativa do navegador, sem biblioteca).
  // O navegador pede permissão para a pessoa antes de informar.
  function usarMinhaLocalizacao() {
    if (!('geolocation' in navigator)) {
      setAvisoLocal('Seu navegador não informa a localização. Digite as coordenadas.');
      return;
    }

    setBuscandoLocal(true);
    setAvisoLocal('');
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        // setValue escreve no campo como se a pessoa tivesse digitado.
        setValue('latitude', Number(posicao.coords.latitude.toFixed(6)), {
          shouldValidate: true,
        });
        setValue('longitude', Number(posicao.coords.longitude.toFixed(6)), {
          shouldValidate: true,
        });
        setBuscandoLocal(false);
        setAvisoLocal('Localização preenchida. Confira se você está no local do problema.');
      },
      () => {
        setBuscandoLocal(false);
        setAvisoLocal(
          'Não foi possível obter a localização. Autorize o acesso ou digite as coordenadas.',
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function enviar(dados: FormularioOcorrencia) {
    if (!morador) return;

    setEnviando(true);
    setErroGeral('');
    setDuplicada(null);
    try {
      const criada = await registrarOcorrencia({
        categoriaId: dados.categoriaId,
        moradorId: morador.id,
        titulo: dados.titulo.trim(),
        descricao: dados.descricao.trim(),
        latitude: dados.latitude,
        longitude: dados.longitude,
        // Campos opcionais vazios não são enviados.
        endereco: dados.endereco.trim() || undefined,
        urlFoto: dados.urlFoto.trim() || undefined,
      });

      mostrarAviso({ tipo: 'sucesso', mensagem: 'Ocorrência registrada com sucesso.' });
      // Se a API devolveu a ocorrência criada, abre o detalhe dela.
      navegar(criada?.id ? `/ocorrencias/${criada.id}` : '/ocorrencias');
    } catch (erro) {
      if (erro instanceof ErroApi && erro.ocorrenciaExistenteId) {
        // 409: já existe uma ocorrência aberta da mesma categoria bem perto.
        setDuplicada({ id: erro.ocorrenciaExistenteId, mensagem: erro.message });
      } else {
        // 400: tenta mostrar o erro ao lado de cada campo recusado.
        const marcou = marcarCamposInvalidos<FormularioOcorrencia>(
          erro,
          ['categoriaId', 'titulo', 'descricao', 'endereco', 'latitude', 'longitude', 'urlFoto'],
          setError,
        );
        setErroGeral(
          marcou ? 'Corrija os campos destacados e envie de novo.' : mensagemDeErro(erro),
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  // Em vez de duplicar o registro, o morador confirma a ocorrência que já existe.
  async function confirmarExistente() {
    if (!morador || !duplicada) return;

    setEnviando(true);
    try {
      await confirmarOcorrencia(duplicada.id, { moradorId: morador.id });
      mostrarAviso({ tipo: 'sucesso', mensagem: 'Confirmação registrada. Obrigado!' });
      navegar(`/ocorrencias/${duplicada.id}`);
    } catch (erro) {
      mostrarAviso({ tipo: 'erro', mensagem: mensagemDeErro(erro) });
    } finally {
      setEnviando(false);
    }
  }

  const titulo = (
    <TituloPagina
      sobretitulo="Ocorrências"
      titulo="Registrar ocorrência"
      descricao="Conte o que está acontecendo e onde. Toda ocorrência nova começa com o status Registrada."
    />
  );

  // Sem login não dá para registrar: a API exige o id do morador.
  if (!morador) {
    return (
      <>
        {titulo}
        <SemDados
          titulo="Entre para registrar"
          texto="Para registrar uma ocorrência você precisa estar conectado à sua conta."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkBotao to="/entrar?voltar=/ocorrencias/nova">Entrar</LinkBotao>
            <LinkBotao to="/cadastro?voltar=/ocorrencias/nova" variante="secundario">
              Criar conta
            </LinkBotao>
          </div>
        </SemDados>
      </>
    );
  }

  return (
    <>
      {titulo}

      {categorias.status === 'carregando' && <Carregando texto="Preparando o formulário..." />}

      {categorias.status === 'erro' && (
        <MensagemErro
          mensagem={categorias.mensagem}
          aoTentarNovamente={() => {
            setCategorias({ status: 'carregando' });
            setTentativa((atual) => atual + 1);
          }}
        />
      )}

      {categorias.status === 'sucesso' && (
        <form
          noValidate
          onSubmit={handleSubmit(enviar)}
          className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-superficie p-5 shadow-sm md:p-8"
        >
          {/* fieldset disabled trava todos os campos enquanto envia. */}
          <fieldset disabled={enviando} className="min-w-0 space-y-5">
            <legend className="sr-only">Dados da ocorrência</legend>

            <CampoFormulario
              id="categoriaId"
              rotulo="Categoria"
              erro={errors.categoriaId?.message}
            >
              <select
                id="categoriaId"
                aria-invalid={!!errors.categoriaId}
                aria-describedby={errors.categoriaId ? 'categoriaId-erro' : undefined}
                className={estiloCampo}
                defaultValue=""
                {...register('categoriaId', {
                  // O select devolve texto; aqui vira número, como a API espera.
                  setValueAs: (valor) => Number(valor),
                  validate: (valor) => valor > 0 || 'Escolha uma categoria.',
                })}
              >
                <option value="">Selecione...</option>
                {categorias.dados.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </CampoFormulario>

            <CampoFormulario
              id="titulo"
              rotulo="Título"
              erro={errors.titulo?.message}
              ajuda="Um resumo curto, de 5 a 100 caracteres."
            >
              <input
                id="titulo"
                type="text"
                maxLength={100}
                aria-invalid={!!errors.titulo}
                aria-describedby={errors.titulo ? 'titulo-erro' : 'titulo-ajuda'}
                className={estiloCampo}
                placeholder="Ex.: Buraco na frente da padaria"
                {...register('titulo', {
                  required: 'Informe um título.',
                  validate: (valor) =>
                    valor.trim().length >= 5 || 'O título precisa de pelo menos 5 caracteres.',
                })}
              />
            </CampoFormulario>

            <CampoFormulario
              id="descricao"
              rotulo="Descrição"
              erro={errors.descricao?.message}
              ajuda="Explique o problema, de 10 a 500 caracteres."
            >
              <textarea
                id="descricao"
                rows={4}
                maxLength={500}
                aria-invalid={!!errors.descricao}
                aria-describedby={errors.descricao ? 'descricao-erro' : 'descricao-ajuda'}
                className={estiloCampo}
                {...register('descricao', {
                  required: 'Descreva o problema.',
                  validate: (valor) =>
                    valor.trim().length >= 10 ||
                    'A descrição precisa de pelo menos 10 caracteres.',
                })}
              />
            </CampoFormulario>

            <CampoFormulario
              id="endereco"
              rotulo="Endereço ou ponto de referência (opcional)"
              erro={errors.endereco?.message}
            >
              <input
                id="endereco"
                type="text"
                maxLength={200}
                aria-invalid={!!errors.endereco}
                className={estiloCampo}
                placeholder="Ex.: Rua Vergueiro, 3000"
                {...register('endereco')}
              />
            </CampoFormulario>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-semibold">Localização do problema</p>
              <p className="mt-1 text-sm text-slate-600">
                Informe o ponto do problema, não o da sua casa. Se você está no
                local, use o botão abaixo.
              </p>
              <Botao
                variante="secundario"
                onClick={usarMinhaLocalizacao}
                disabled={buscandoLocal}
                className="mt-3"
              >
                {buscandoLocal ? 'Obtendo localização...' : 'Usar minha localização'}
              </Botao>
              {avisoLocal && (
                <p role="status" className="mt-2 text-sm font-medium text-slate-700">
                  {avisoLocal}
                </p>
              )}

              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <CampoFormulario
                  id="latitude"
                  rotulo="Latitude"
                  erro={errors.latitude?.message}
                >
                  <input
                    id="latitude"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    aria-invalid={!!errors.latitude}
                    aria-describedby={errors.latitude ? 'latitude-erro' : undefined}
                    className={estiloCampo}
                    placeholder="-23.5935"
                    {...register('latitude', {
                      // valueAsNumber entrega número em vez de texto.
                      valueAsNumber: true,
                      validate: (valor) =>
                        (!Number.isNaN(valor) && valor >= -90 && valor <= 90) ||
                        'Informe uma latitude entre -90 e 90.',
                    })}
                  />
                </CampoFormulario>

                <CampoFormulario
                  id="longitude"
                  rotulo="Longitude"
                  erro={errors.longitude?.message}
                >
                  <input
                    id="longitude"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    aria-invalid={!!errors.longitude}
                    aria-describedby={errors.longitude ? 'longitude-erro' : undefined}
                    className={estiloCampo}
                    placeholder="-46.6402"
                    {...register('longitude', {
                      valueAsNumber: true,
                      validate: (valor) =>
                        (!Number.isNaN(valor) && valor >= -180 && valor <= 180) ||
                        'Informe uma longitude entre -180 e 180.',
                    })}
                  />
                </CampoFormulario>
              </div>
            </div>

            <CampoFormulario
              id="urlFoto"
              rotulo="Link de uma foto (opcional)"
              erro={errors.urlFoto?.message}
              ajuda="Cole o endereço de uma foto já publicada, começando com http:// ou https://."
            >
              <input
                id="urlFoto"
                type="url"
                inputMode="url"
                maxLength={300}
                aria-invalid={!!errors.urlFoto}
                aria-describedby={errors.urlFoto ? 'urlFoto-erro' : 'urlFoto-ajuda'}
                className={estiloCampo}
                placeholder="https://"
                {...register('urlFoto', {
                  validate: (valor) =>
                    !valor.trim() ||
                    linkValido(valor) ||
                    'O link precisa começar com http:// ou https://.',
                })}
              />
            </CampoFormulario>

            {erroGeral && (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 p-3 font-medium text-rose-900"
              >
                {erroGeral}
              </p>
            )}

            {duplicada && (
              <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <h2 className="text-lg font-bold text-amber-950">
                  Já existe uma ocorrência parecida
                </h2>
                <p className="mt-2 leading-relaxed text-amber-950">{duplicada.mensagem}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Botao onClick={confirmarExistente}>Confirmar a ocorrência existente</Botao>
                  <LinkBotao to={`/ocorrencias/${duplicada.id}`} variante="secundario">
                    Ver a ocorrência existente
                  </LinkBotao>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Botao type="submit">
                {enviando ? 'Enviando...' : 'Registrar ocorrência'}
              </Botao>
              <LinkBotao to="/ocorrencias" variante="secundario">
                Cancelar
              </LinkBotao>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}
