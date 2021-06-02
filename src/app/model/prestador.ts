import { Especialidad } from './especialidad';
import { IdentificacionTipo } from './identificacionTipo';
import { PrestadorPlan } from './prestadorPlan';
import { PrestadorTipo } from './prestadorTipo';
import { Usuario } from './usuario';
import { Zonal } from './zonal';

export class Prestador {
    IDPrestador: number;
    ComiteFecha: string;
    Ciudad: string;
    Zonal: Zonal;
    IdentificacionTipo: IdentificacionTipo;
    Identificacion: string;
    Nombre: string;
    ConsultorioDireccion: string;
    ConsultorioTelefono: string;
    Celular: string;
    Email: string;
    Servicios: string;
    Tarifas: string;
    Expediente: string;
    Direccion: string;
    Verificado: string;
    PrestadorTipo: PrestadorTipo;
    PrestadorPlan: PrestadorPlan;
    Especialidad: Especialidad;
    Usuario: Usuario;
    Activo: boolean;
    Completado: boolean;
    CelularOtro: number;
    EmailOtro: string;
    IDDepartamento: number;
}

export class PrestadorReport {
    IDPrestador: number;
    ComiteFecha: string;
    Ciudad: string;
    Zonal: string;
    IdentificacionTipo: string;
    Identificacion: string;
    Nombre: string;
    ConsultorioDireccion: string;
    ConsultorioTelefono: string;
    Celular: string;
    Email: string;
    Servicios: string;
    Tarifas: string;
    Expediente: string;
    Direccion: string;
    Verificado: string;
    PrestadorTipo: string;
    PrestadorPlan: string;
    Especialidad: string;
    Usuario: string;
    Activo: boolean;
    Completado: boolean;
    CelularOtro: number;
    EmailOtro: string;
}
export class PrestadorEspecialidad {
    IDPrestadorEspecialidad: number;
    IDPrestador: number;
    IDEspecialidad: number;
    Especialidad: string;
}
