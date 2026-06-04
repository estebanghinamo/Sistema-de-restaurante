import { ResolveFn } from '@angular/router';
import { IPromocion } from '../api/models/i-promocion.model';
import { inject } from '@angular/core';
import { PromocionResource } from '../api/resources/promocion.resource';

export const promocionesResolver: ResolveFn<IPromocion[]> = (route, state) => {
  return inject(PromocionResource).getPromociones();
};
