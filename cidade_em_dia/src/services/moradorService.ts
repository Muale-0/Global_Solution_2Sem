import type { LoginPayload, Morador, MoradorPayload } from '../types/morador';
import { requisitar } from './api';

// POST /moradores
export function cadastrarMorador(morador: MoradorPayload) {
  return requisitar<Morador | undefined>('/moradores', 'POST', morador);
}

// POST /moradores/login — devolve o morador (sem senha) ou erro 401.
export function fazerLogin(credenciais: LoginPayload) {
  return requisitar<Morador>('/moradores/login', 'POST', credenciais);
}
