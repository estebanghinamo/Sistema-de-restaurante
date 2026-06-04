import { ITurno } from './i-turno.model';
import { IZona } from './i-zona.model';
import { IPreferencia } from './i-preferencia.model';
import {IPromocion} from './i-promocion.model';
export interface ISucursal {
    nroSucursal: number;
    nomSucursal: string;
    calle: string | null;
    nroCalle: string | null;           
    barrio: string | null;
    nroLocalidad: number;
    nomLocalidad: string;
    codProvincia: number;
    nomProvincia: string;
    codPostal: string | null;
    telefonos: string | null;
    totalComensales: number | null;
    minTolerenciaReserva: number | null;
    codSucursalRestaurante: string;
    turnos: ITurno[];
    zonas: IZona[];
    preferencias: IPreferencia[];
    promociones?: IPromocion[];
    cargandoPromos?: boolean;
}
