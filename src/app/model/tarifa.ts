import { Servicio } from './servicio';

export class Tarifa {
    IDTarifa: number;
    Servicio: Servicio;
    Plus: number;
    GoldColectivo: number;
    Care: string;
    UVR: string;
    Vigencia: string;
}
export class TarifaVigencia {
    IDTarifaVigencia: number;
    VigenciaInicial: string;
    VigenciaFinal: number;
    Porcentage: number;
    Activo: string;
    ParentTV: string;
}
export class TarifaReport {
    IDServicio: number;
    CodigoAnterior: string;
    Descripcion: string;
    Resolucion3495: string;
    Descripcion3495: string;
    IDTarifa: number;
    Servicio: Servicio;
    Plus: number;
    GoldColectivo: number;
    Care: string;
    UVR: string;
    Vigencia: string;
}
export class TarifaServicio {
    IDTarifaPrestador: number;
    IDPrestador: number;
    IDTarifa: number;
    GoldColectivo: number;
    Plus: number;
    Care: number;
    Servicio: Servicio;
    Uvr: number;
    Nota: String;
    Realizacion: boolean;
}

export class TarifaPrestador {
    IDTarifaPrestador: number;
    IDPrestador: number;
    IDTarifa: number;
    GoldColectivo: number;
    Plus: number;
    Care: number;
    Servicio: Servicio;
    Uvr: number;
    Nota: String;
    Realizacion: number;
    EsTarifaPropia: boolean;
    IDTarifaQuirurgico: number;
}

