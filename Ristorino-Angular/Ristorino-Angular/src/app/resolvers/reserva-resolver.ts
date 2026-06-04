import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { RestauranteResource } from '../api/resources/restaurante.resource';
import { of, catchError } from 'rxjs';
import { UsuarioResource } from '../api/resources/usuario.resource';
import { IHistorial } from '../api/models/i-historial.model';

export const reservaResolver: ResolveFn<IHistorial> = (route, state) => {
  return inject(UsuarioResource).getHistorial();

};