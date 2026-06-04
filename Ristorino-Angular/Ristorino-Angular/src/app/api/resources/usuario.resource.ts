import { Injectable } from '@angular/core';
import { Resource, ResourceAction, ResourceHandler, ResourceParams, ResourceRequestMethod, IResourceMethodObservable } from '@ngx-resource/core';
import { environment } from '../../../environments/environment';
import {  IHistorial } from '../models/i-historial.model';
import { Observable } from 'rxjs';
import { IReserva } from '../models/i-reserva.model';
export interface ICancelarReservaReq {
  codReservaSucursal: string;
  nroRestaurante: number;
}
export interface IEvaluarReservaReq {
  codReservaSucursal: string;
  nroRestaurante: number;
  feedback?: string;
  puntuacion?: number;
}

export interface IEvaluarReservaResp {
  success: boolean;
  status?: string;
  message?: string;
}
export interface ICancelarReservaResp {
  success: boolean;
  status?: string;
  message?: string;
  
}
/*export interface IReconfirmarReservaReq {
  codReservaSucursal: string;
  nroRestaurante: number;
}

export interface IReconfirmarReservaResp {
  success: boolean;
  message?: string;
}*/

@Injectable({ providedIn: 'root' })
@ResourceParams({
  pathPrefix: `${environment.apiUrl}`
})
export class UsuarioResource extends Resource {

  constructor(handler: ResourceHandler) {
    super(handler);
  }
  


  @ResourceAction({
    method: ResourceRequestMethod.Get,
    path: '/misReservas'
  })
   declare getHistorial: IResourceMethodObservable<void, IHistorial>;

  
   @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/cancelarReserva'
  })
  declare cancelarReserva: IResourceMethodObservable<ICancelarReservaReq, ICancelarReservaResp>;
  

  @ResourceAction({
    method: ResourceRequestMethod.Post,
    path: '/modificarReserva'
  })
  declare modificarReserva: IResourceMethodObservable<any, any>;


  @ResourceAction({
  method: ResourceRequestMethod.Post,
  path: '/evaluarReserva'
})
declare evaluarReserva: IResourceMethodObservable<IEvaluarReservaReq, IEvaluarReservaResp>;

/*@ResourceAction({
  method: ResourceRequestMethod.Post,
  path: '/reconfirmarReserva'
})
declare reconfirmarReserva: IResourceMethodObservable<
  IReconfirmarReservaReq,
  IReconfirmarReservaResp
>;*/
}