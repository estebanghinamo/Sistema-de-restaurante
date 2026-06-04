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
import { IRestauranteHomeModel } from '../../api/models/i-restaurante-home.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}`
})
export class RestauranteshomeResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/listarRestaurantesHome',
    responseBodyType: ResourceResponseBodyType.Json
  })
  declare listarRestaurantesHome:
    IResourceMethodObservable<void, IRestauranteHomeModel[]>;
}
