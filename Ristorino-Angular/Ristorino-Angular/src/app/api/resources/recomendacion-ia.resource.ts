import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
  ResourceResponseBodyType
} from '@ngx-resource/core';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { environment } from '../../../environments/environment';
import { IRecomendacionIa } from '../models/i-recomendacion-ia';

@Injectable()
@ResourceParams({
  pathPrefix: environment.apiUrl
})
export class RecomendacionIaResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/ia/recomendaciones',
    responseBodyType: ResourceResponseBodyType.Json
  })
 declare buscar: IResourceMethodObservable<
  {
    texto: string;
    emailUsuario?: string | null;
  },
  IRecomendacionIa[]
>;

}
