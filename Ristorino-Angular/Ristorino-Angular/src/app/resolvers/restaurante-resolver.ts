import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RestauranteResource } from '../api/resources/restaurante.resource';
import { IRestaurante } from '../api/models/i-restaurante.model';

export const restauranteResolver: ResolveFn<IRestaurante> = (route) => {
  const resource = inject(RestauranteResource);

  const id = route.params['id'];
 

  if (!id) {
    throw new Error('ID de restaurante obligatorio');
  }



 
  return resource.getRestaurante({
    id
  });
};
