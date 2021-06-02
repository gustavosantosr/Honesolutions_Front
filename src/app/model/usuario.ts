import { Propietario } from './propietario';
import { Conductor } from './conductor';
import { Cliente } from './cliente';
import { Rol } from './rol';

export class Usuario {
    IDUsuario: number;
    Nombre: string;
    Email: string;
    Contrasena: string;
    Tipo: number;
    Rol: Rol;
    token:string;


}
