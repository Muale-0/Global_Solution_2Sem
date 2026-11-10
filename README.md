# Cidade em Dia

Plataforma de zeladoria urbana para a cidade de São Paulo. Moradores registram problemas de infraestrutura (buracos, alagamentos, iluminação, lixo, acessibilidade, arborização), a vizinhança confirma e a gestão pública atualiza o andamento de cada ocorrência.

Projeto da **Global Solution 2026/2 da FIAP**, tema **CitizenTech**, disciplina **Front-End Design Engineering**. Turma **1TDSPH**.

## Links

| O quê | Endereço |
| --- | --- |
| Repositório no GitHub | https://github.com/Muale-0/Global_Solution_2Sem |
| Aplicação publicada (Vercel) | _a preencher após o deploy_ |
| API Java (Render) | _a preencher quando a API for publicada_ |
| Vídeo de demonstração (YouTube) | _a preencher após a gravação_ |

## Objetivo

Reunir em um só lugar os problemas urbanos apontados pelos moradores e as respostas da gestão pública, para que cada registro possa ser acompanhado do início ao fim.

O que a aplicação faz:

- lista as ocorrências, com filtro por status e categoria;
- mostra o detalhe de cada ocorrência, com a linha do tempo das mudanças de status;
- permite ao morador criar conta, entrar, registrar ocorrências e confirmar as de outros moradores;
- avisa quando já existe uma ocorrência parecida no mesmo local e oferece confirmá-la em vez de duplicar;
- oferece à gestão pública um painel com o total por status e a atualização do andamento.

O projeto se conecta aos ODS 9 (Indústria, inovação e infraestrutura), 11 (Cidades e comunidades sustentáveis) e 16 (Paz, justiça e instituições eficazes).

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| React 19 | Construção da interface em componentes |
| Vite 8 | Servidor de desenvolvimento e geração do site final |
| TypeScript | Tipagem de props, estados e dados da API |
| Tailwind CSS 4 | Estilização e responsividade |
| React Router DOM 7 | Rotas da aplicação (SPA) |
| React Hook Form 7 | Formulários e validações |
| Fetch API | Chamadas HTTP à API Java (sem Axios ou outra biblioteca) |
| Oxlint | Verificação do código |

## Integração com a API

O front-end consome a API REST em Java (Spring Boot) da disciplina Domain Driven Design Using Java. Todas as chamadas passam pela função `requisitar`, em `cidade_em_dia/src/services/api.ts`, que usa a Fetch API.

| Método | Rota da API | Onde é usada |
| --- | --- | --- |
| GET | `/ocorrencias?status=&categoriaId=` | Lista de ocorrências e painel da gestão |
| GET | `/ocorrencias/{id}` | Detalhe da ocorrência |
| GET | `/ocorrencias/{id}/atualizacoes` | Linha do tempo |
| GET | `/ocorrencias/{id}/confirmacoes` | Confirmações e comentários |
| GET | `/categorias` | Filtros e formulário de registro |
| POST | `/ocorrencias` | Registrar ocorrência |
| POST | `/ocorrencias/{id}/confirmacoes` | Confirmar ocorrência |
| POST | `/ocorrencias/{id}/atualizacoes` | Atualizar status (gestão) |
| POST | `/moradores` | Criar conta |
| POST | `/moradores/login` | Entrar |

A aplicação trata os três estados de cada busca (carregando, erro e lista vazia) e mostra as mensagens de erro devolvidas pela API, inclusive por campo nos erros de validação.

### Endereço da API

O endereço fica em uma variável de ambiente, para trocar entre a API local e a publicada sem mexer no código:

```bash
cd cidade_em_dia
cp .env.example .env.local
# edite o .env.local, por exemplo:
# VITE_API_URL=http://localhost:8080
```

Na Vercel, a mesma variável `VITE_API_URL` é configurada no painel do projeto.

## Estrutura de pastas

```
Global_Solution_2Sem/
├── README.md
├── integrantes.txt
└── cidade_em_dia/
    ├── index.html
    ├── package.json
    ├── vite.config.ts          configuração do Vite (React + Tailwind)
    ├── vercel.json             faz as rotas funcionarem ao abrir direto pelo endereço
    ├── .env.example            modelo da variável VITE_API_URL
    ├── public/                 favicon
    └── src/
        ├── main.tsx            mapa de rotas
        ├── App.tsx             moldura das páginas (cabeçalho, conteúdo, rodapé)
        ├── assets/             fotos dos integrantes
        ├── css/                entrada do Tailwind e cores do projeto
        ├── components/         componentes reutilizáveis (Botao, Cartao, CartaoOcorrencia...)
        ├── pages/              uma pasta por página
        ├── services/           chamadas à API (api.ts e um arquivo por entidade)
        ├── types/              tipos e interfaces TypeScript
        ├── contexto/           sessão do morador e avisos
        ├── dados/              conteúdo fixo do site (FAQ, integrantes, status)
        └── utils/              formatação e validação
```

## Como executar

Requisitos: [Node.js](https://nodejs.org/) 20 ou mais recente (inclui o npm).

```bash
git clone https://github.com/Muale-0/Global_Solution_2Sem.git
cd Global_Solution_2Sem/cidade_em_dia
npm install
cp .env.example .env.local   # ajuste o endereço da API
npm run dev
```

Depois abra o endereço mostrado no terminal (por padrão, http://localhost:5173).

Se recebeu o projeto em ZIP, descompacte, entre em `cidade_em_dia` e rode os mesmos comandos a partir de `npm install`.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Confere os tipos e gera o site final em `dist/` |
| `npm run preview` | Abre o site gerado pelo build |
| `npm run lint` | Verifica o código com o Oxlint |

## Páginas e rotas

| Rota | Página |
| --- | --- |
| `/` | Home |
| `/integrantes` | Integrantes |
| `/sobre` | Sobre |
| `/faq` | Perguntas frequentes |
| `/contato` | Contato |
| `/ocorrencias` | Lista de ocorrências |
| `/ocorrencias/nova` | Registrar ocorrência |
| `/ocorrencias/:id` | Detalhe da ocorrência (rota com parâmetro) |
| `/entrar` | Login do morador |
| `/cadastro` | Cadastro de morador |
| `/gestao` | Painel da gestão pública |
| `/gestao/ocorrencias/:id` | Atualização de status (rota com parâmetro) |
| qualquer outra | Página não encontrada |

O layout foi conferido em 390 × 844 (celular), 768 × 1024 (tablet) e 1440 × 900 (computador).

## Integrantes

Turma: **1TDSPH**.

| Integrante | RM | Redes |
| --- | --- | --- |
| Giovanni Lopez Zavam | RM571403 | [GitHub](https://github.com/Giovanni0403) · [LinkedIn](https://www.linkedin.com/in/giovanni-lopez-zavam/) |
| Thiago Andrade Silva Piedade | RM569741 | [GitHub](https://github.com/Euthiaguera) · [LinkedIn](https://www.linkedin.com/in/thiago-andrade-08b2b6321/) |
| Arthur Palacio Alves | RM573441 | [GitHub](https://github.com/ruhtradev10) · [LinkedIn](https://www.linkedin.com/in/arthur-palacio-alves-3911a13b3/) |
| Murilo Martins de Campos | RM572674 | [GitHub](https://github.com/Muale-0) · [LinkedIn](https://www.linkedin.com/in/murilo-martins-de-campos-573727410/) |

## Uso de IA generativa

O assistente Claude (Anthropic) foi usado como apoio no planejamento das etapas, na escrita e na explicação do código do front-end. O conteúdo gerado foi revisado e testado pelo grupo, e o registro detalhado (prompts, o que foi aceito, corrigido ou descartado) está no documento da disciplina Software Engineering and Business Model.

## Contato

| Integrante | E-mail |
| --- | --- |
| Giovanni Lopez Zavam | [rm571403@fiap.com.br](mailto:rm571403@fiap.com.br) |
| Thiago Andrade Silva Piedade | [rm569741@fiap.com.br](mailto:rm569741@fiap.com.br) |
| Arthur Palacio Alves | [rm573441@fiap.com.br](mailto:rm573441@fiap.com.br) |
| Murilo Martins de Campos | [rm572674@fiap.com.br](mailto:rm572674@fiap.com.br) |
