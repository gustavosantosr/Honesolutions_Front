import { Menu } from './menu';
import { Rol } from './rol';

export class Permiso {
    IDPermiso: number;
    Menu: Menu;
    Leer: boolean;
    Escribir: boolean;
    Actualizar: boolean;
    Desactivar: boolean;
    Rol: Rol;
}
