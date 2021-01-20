import { DocumentoTipo } from './documentoTipo';
import { SangreTipo } from './sangreTipo';

export class Propietario {
    IDPropietario: number;
    DocumentoTipo: DocumentoTipo;
    Documento: number;
    Nombres: string;
    Apellidos: string;
    FechaNacimiento: string;
    FechaRegistro: string;
    Email: string;
    URLFoto: string;
    Celular: number;

}
