import { DocumentoTipo } from './documentoTipo';
import { PrestadorTipo } from './prestadorTipo';


export class DocumentoRequerido {
    IDDocumentoRequerido: number;
    DocumentoRequerido: string;
    CampoRequerido: string;
    CampoRequeridoValor: string;
    PrestadorTipo: PrestadorTipo;
    DocumentoTipo: DocumentoTipo;
    URLSigned: string;
    Version: number;
}
export class DocumentoReporte {
    FechaRegistro: number;
    Validado: boolean;
    FechaVencimiento: string;
    ComiteFecha: string;
    Identificacion: string;
    DocumentoTipo: string;
    URL: string;
}
