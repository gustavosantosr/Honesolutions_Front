import { Cliente } from './cliente';
import { ServicioTipo } from './servicioTipo';

export class Pieza {
    IDPieza: number;
    Codigo: string;
    ServicioTipo: ServicioTipo;
    Numero: string;
    Lote: number;
    Descripcion: string;
    MetrosRecibidos: number;
    FechaRegistro: string;
    Observaciones: string;
    IDUsuario: number;
    Cliente: Cliente;
}
