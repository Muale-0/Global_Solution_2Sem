import type { Categoria } from '../types/categoria';
import { requisitar } from './api';

// GET /categorias
export function listarCategorias() {
  return requisitar<Categoria[]>('/categorias');
}
