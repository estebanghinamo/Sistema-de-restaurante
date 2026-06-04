export interface ISucursalModel {
  nroSucursal: number;
  nomSucursal: string;
  calle?: string;
  nroCalle?: number;
  barrio?: string;
  codPostal?: string;
  telefonos?: string;

  preferencias: {
    [categoria: string]: string[];
  };
}
