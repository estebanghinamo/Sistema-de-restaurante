import { ISucursal } from './i-sucursal.model'; 
export interface IRestaurante {
  nroRestaurante: string;
  razonSocial: string;
  sucursales: ISucursal[];
  costoReservaBase: number;
}