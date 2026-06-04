export interface IHorario {
  horaReserva: string;       
  horaHasta: string;
}
export interface IHorarioRespuesta {
  costo : number;      
  horarios: IHorario[]; 
}

