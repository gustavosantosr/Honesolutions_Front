import { Ciudad } from './ciudad';
import { CuentaTipo } from './cuentaTipo';
import { IdentificacionTipo } from './identificacionTipo';


export class Cliente {
    IDCliente: number;
    Nombres: string;
    Email: string;
    Direccion: string;
    Telefono: number;
    Celular: string;
    Ciudad: Ciudad;
    IdentificacionTipo: IdentificacionTipo;
    Identificacion: string;
    DV: number;
    ActividadRut: string;
    ActividadCodigo: string;
    Banco: string;
    CuentaTipo: CuentaTipo;
    Activo: boolean;
    CelularOtro: number;
    EmailOtro: string;



}
