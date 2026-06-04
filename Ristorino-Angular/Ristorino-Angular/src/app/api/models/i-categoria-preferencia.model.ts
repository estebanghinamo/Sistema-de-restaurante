import {IDominioPreferenciaModel} from './i-dominio-preferencia.model';

export interface ICategoriaPreferencia {
  codCategoria: number;
  nomCategoria: string;
  dominios: IDominioPreferenciaModel[];
}