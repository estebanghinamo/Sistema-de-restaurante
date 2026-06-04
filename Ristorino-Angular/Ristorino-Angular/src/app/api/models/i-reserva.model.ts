export interface IReserva {
  codSucursalRestaurante: string;
  correo: string;
  idSucursal: number;
  fechaReserva: string; // "yyyy-MM-dd"
  horaReserva: string;  // "HH:mm:ss"
  cantAdultos: number;
  cantMenores: number;
  codZona: number;
  costoReserva: number;

  //observaciones?:string

  //tipoReserva:String;
}