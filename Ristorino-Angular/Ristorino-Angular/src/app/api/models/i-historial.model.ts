export interface EstadoReserva {
  codEstado: number;
  nomEstado: string;
}

export interface IReservaCliente {
  nroCliente: number;
  nroReserva: number;
  codReservaSucursal: string;
  fechaReserva: string; // "yyyy-MM-dd"
  horaReserva: string;  // "HH:mm:ss"
  cantAdultos: number;
  cantMenores: number;
  costoReserva: number;
  codEstado: number;
  nomEstado: string;
  nroRestaurante: number;
  nombreRestaurante: string;
  nroSucursal: number;
  nombreSucursal: string;
  fechaCancelacion: string; // "yyyy-MM-dd"
  feedback:string;
  puntuacion:number;
}

export interface IHistorial{
  reservas: IReservaCliente[];
  estados: EstadoReserva[];
}