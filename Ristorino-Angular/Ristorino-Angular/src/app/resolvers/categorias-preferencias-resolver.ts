import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ICategoriaPreferencia } from '../api/models/i-categoria-preferencia.model';
import { CategoriaPreferenciaResource } from '../api/resources/categoria-preferencia.resource';

export const categoriasPreferenciasResolver:ResolveFn<ICategoriaPreferencia[]> = () => {
  return inject(CategoriaPreferenciaResource).getCategoriasPreferencias();
};
