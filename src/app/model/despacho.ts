import { Cliente } from './cliente';
import { DespachoEstado } from './despachoEstado';
import { Usuario } from './usuario';
export class Despacho {
    IDDespacho: number;
    Cliente: Cliente;
    FechaDespacho: string;
    DespachoEstado: DespachoEstado;
    Usuario: Usuario;
    IDUsuario: number;
}
