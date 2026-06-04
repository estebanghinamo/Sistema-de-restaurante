export interface IZona {
    codZona: number;
    nomZona: string | null;        // el RS4 devuelve "desc_zona"   le cambie el nombre descZona fijarse bean zonas de ristorino
    cantComensales: number | null;
    permiteMenores: boolean;
    habilitada: boolean;
}
