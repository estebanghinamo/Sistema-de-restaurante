export interface ISolicitudHorario {
  codSucursalRestaurante: string;
  idSucursal: number;
  fecha: string;        // "yyyy-MM-dd"
  cantComensales: number;
  codZona?: number;
  menores: boolean;
}
