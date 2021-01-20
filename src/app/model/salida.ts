import { Despacho } from './despacho';
import { Pieza } from './pieza';
import { ServicioTipo } from './servicioTipo';
import { Usuario } from './usuario';

export class Salida {
    IDSalida: number;
    IDDespacho: number;
    MetrosDespachados: number;
    IDPieza:number;
    Pieza: Pieza;
    Despacho: Despacho;
    Usuario: Usuario;

}
