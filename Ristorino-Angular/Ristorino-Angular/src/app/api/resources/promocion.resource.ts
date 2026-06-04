import { Injectable } from '@angular/core';
import { Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestBodyType, ResourceRequestMethod, ResourceResponseBodyType } from '@ngx-resource/core';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { environment } from '../../../environments/environment';
import { IPromocion } from '../models/i-promocion.model';
import { IClickPromocion } from '../models/i-click-promocion.model';  
@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}`
})
export class PromocionResource extends Resource{
    constructor(handler: ResourceHandler) {
    super(handler);
  }
  @ResourceAction({
  method: ResourceRequestMethod.Get,
  path: '/obtenerPromociones',
  responseBodyType: ResourceResponseBodyType.Json
})
declare getPromociones: IResourceMethodObservable<void, IPromocion[]>;

@ResourceAction({
  method: ResourceRequestMethod.Get,
  path: '/obtenerPromociones',
  responseBodyType: ResourceResponseBodyType.Json
})
declare getPromocionesPorSucursal: IResourceMethodObservable<
  { nroRestaurante?: string; nroSucursal?: number },
  IPromocion[]
>;

  
  @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/registrarClickPromocion',
        requestBodyType: ResourceRequestBodyType.JSON
      })
      declare registrarClick: IResourceMethodObservable<IClickPromocion,void>;

}
