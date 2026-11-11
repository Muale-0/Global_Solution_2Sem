import fotoArthur from '../assets/arthur.jpg';
import fotoGiovanni from '../assets/giovanni.jpg';
import fotoMurilo from '../assets/murilo.jpg';
import fotoThiago from '../assets/thiago.jpg';
import type { Integrante } from '../types/site';

// Importar a imagem faz o Vite copiar o arquivo para o site final
// e devolver o endereço certo dela.
export const integrantes: Integrante[] = [
  {
    nome: 'Giovanni Lopez Zavam',
    rm: '571403',
    turma: '1TDSPH',
    foto: fotoGiovanni,
    github: 'https://github.com/Giovanni0403',
    linkedin: 'https://www.linkedin.com/in/giovanni-lopez-zavam/',
  },
  {
    nome: 'Thiago Andrade Silva Piedade',
    rm: '569741',
    turma: '1TDSPH',
    foto: fotoThiago,
    github: 'https://github.com/Euthiaguera',
    linkedin: 'https://www.linkedin.com/in/thiago-andrade-08b2b6321/',
  },
  {
    nome: 'Arthur Palacio Alves',
    rm: '573441',
    turma: '1TDSPH',
    foto: fotoArthur,
    github: 'https://github.com/ruhtradev10',
    linkedin: 'https://www.linkedin.com/in/arthur-palacio-alves-3911a13b3/',
  },
  {
    nome: 'Murilo Martins de Campos',
    rm: '572674',
    turma: '1TDSPH',
    foto: fotoMurilo,
    github: 'https://github.com/Muale-0',
    linkedin: 'https://www.linkedin.com/in/murilo-martins-de-campos-573727410/',
  },
];

// E-mail que recebe as mensagens do formulário de contato.
export const emailContato = 'rm572674@fiap.com.br';
