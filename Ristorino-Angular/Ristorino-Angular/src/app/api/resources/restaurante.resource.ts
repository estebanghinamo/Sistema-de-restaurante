import { Injectable } from '@angular/core';
import { 
  Resource, 
  ResourceAction, 
  ResourceHandler, 
  ResourceParams, 
  ResourceRequestMethod
} from '@ngx-resource/core';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { environment } from '../../../environments/environment';
import { IRestaurante } from '../models/i-restaurante.model';
import { IReserva } from '../models/i-reserva.model';
import { IHorarioRespuesta } from '../models/i-horario-respuesta.model';
import { ISolicitudHorario } from '..//models/i-solicitud-horario.model';
import { IZona } from '../models/i-zona.model';

// --- INTERFACES AUXILIARES (Para consultar disponibilidad) ---



@Injectable({ providedIn: 'root' })
@ResourceParams({
  pathPrefix: `${environment.apiUrl}`
})
export class RestauranteResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }

 
  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/obtenerRestaurante/{!id}'

  })
  declare getRestaurante: IResourceMethodObservable<{id: number}, IRestaurante>;

 
  @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/registrarReserva'

  })
  declare RegistrarReserva: IResourceMethodObservable<IReserva, any>;

 
  @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/consultarDisponibilidad'
  })
  declare consultarDisponibilidad: IResourceMethodObservable<ISolicitudHorario, IHorarioRespuesta>;

 
 

  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/zonasSucursal'
  })
  declare getZonasSucursal: IResourceMethodObservable<
    { nroRestaurante: number; nroSucursal: number },
    IZona[]
  >;
}