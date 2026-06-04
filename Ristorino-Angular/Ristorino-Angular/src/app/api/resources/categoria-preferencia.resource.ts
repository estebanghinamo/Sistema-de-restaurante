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
import { ICategoriaPreferencia } from '../models/i-categoria-preferencia.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}`
})
export class CategoriaPreferenciaResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/categoriasPreferencias',
    responseBodyType: ResourceResponseBodyType.Json
  })
  declare getCategoriasPreferencias:
    IResourceMethodObservable<void, ICategoriaPreferencia[]>;
}
