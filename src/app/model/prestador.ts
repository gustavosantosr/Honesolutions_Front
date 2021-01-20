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
}
