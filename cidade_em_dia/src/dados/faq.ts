import type { GrupoFaq } from '../types/site';

export const gruposFaq: GrupoFaq[] = [
  {
    titulo: 'Sobre a plataforma',
    itens: [
      {
        pergunta: 'O que é o Cidade em Dia?',
        resposta:
          'É uma plataforma de zeladoria urbana para São Paulo. Moradores registram problemas como buracos, alagamentos e falhas de iluminação, e a gestão pública atualiza o andamento de cada registro.',
      },
      {
        pergunta: 'O Cidade em Dia substitui os canais oficiais da prefeitura?',
        resposta:
          'Não. Nesta versão a plataforma funciona de forma independente, como ferramenta complementar de organização e acompanhamento. Ela também não atende emergências.',
      },
      {
        pergunta: 'Preciso pagar para usar?',
        resposta:
          'Não. O uso é gratuito para os moradores. O modelo de negócio prevê a contratação da plataforma pelos municípios.',
      },
    ],
  },
  {
    titulo: 'Registro de ocorrências',
    itens: [
      {
        pergunta: 'Como registro um problema?',
        resposta:
          'Crie uma conta ou entre na sua, abra "Registrar ocorrência", escolha a categoria, descreva o problema e informe o local. Você pode usar a localização do seu aparelho ou digitar as coordenadas.',
      },
      {
        pergunta: 'Por que o sistema avisou que já existe uma ocorrência parecida?',
        resposta:
          'Quando já existe uma ocorrência aberta da mesma categoria a até 30 metros do ponto informado, a plataforma mostra o registro existente. Em vez de duplicar, você pode confirmar que o problema continua lá.',
      },
      {
        pergunta: 'O que é confirmar uma ocorrência?',
        resposta:
          'É dizer que você também viu o problema. Cada morador confirma uma vez, não pode confirmar o próprio registro e ocorrências encerradas não recebem confirmações. O número de confirmações ajuda a gestão a entender a relevância da demanda.',
      },
    ],
  },
  {
    titulo: 'Acompanhamento e privacidade',
    itens: [
      {
        pergunta: 'Quais são os status de uma ocorrência?',
        resposta:
          'Registrada, Em análise, Em execução, Concluída e Descartada. Só a gestão pública muda o status, sempre com uma descrição do que foi feito.',
      },
      {
        pergunta: '"Concluída" significa que o problema foi resolvido?',
        resposta:
          'Significa que a gestão pública informou o encerramento e anexou uma evidência. A plataforma registra essa informação, mas não faz uma verificação técnica independente.',
      },
      {
        pergunta: 'Meus dados aparecem para outras pessoas?',
        resposta:
          'Nas páginas públicas mostramos o endereço do problema, sem coordenadas exatas e sem o nome de quem registrou. As coordenadas ficam disponíveis apenas no painel da gestão.',
      },
    ],
  },
];
