export interface ICliente {
  apellido: string;
  nombre: string;
  correo: string;
  clave: string;
  telefonos: string;
  nomLocalidad: string;
  nomProvincia: string;
  observaciones?: string;

 
  codCategoria?: number;
  nroValorDominio?: number;


  preferencias?: {
    codCategoria: number;
    dominios: number[];
  }[];
}
