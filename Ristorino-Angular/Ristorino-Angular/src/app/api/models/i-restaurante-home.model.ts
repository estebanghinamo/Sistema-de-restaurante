import { ISucursalModel } from "../models/i-sucursal-home.model"

export interface IRestauranteHomeModel {
  nroRestaurante: string;
  razonSocial: string;

  //destacado:string;//ATENCION si utilizo esto y quiero usarlo para una reserva, debo acomodar el otro modelo del restaurante.model.ts y modificar el sp obtenerrestauranteid(resouce ) para que traiga ese dato, yaque la reserva utiliza la otra clase
//una vez hecho eso que tengo el dato en el modelo, solo toco la reserva ts, descomentar los 3 lados y el html
  categorias: {[categoria: string]: string[];};
  sucursales: ISucursalModel[];
  promedioValoracion: number;

cantidadReservas:number;
rankingReservas:number;
esFavorito?: boolean; 
}
