import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RecomendacionIaResource } from '../api/resources/recomendacion-ia.resource';
import { IRecomendacionIa } from '../api/models/i-recomendacion-ia';
import { map, of } from 'rxjs';

export const iaRecomendacionesResolver: ResolveFn<IRecomendacionIa[]> = (route) => {

  const texto = route.queryParams['q'];

  if (!texto) {
    return of([]);
  }
  const emailUsuario = localStorage.getItem('email');
  return inject(RecomendacionIaResource)
  .buscar({ texto,
    emailUsuario: emailUsuario ? emailUsuario : null
   })
  .pipe(
    map(lista =>
      lista
        .filter(r => r.coincidencias > 0)
        .sort((a, b) => b.coincidencias - a.coincidencias)
    )
  );
};
