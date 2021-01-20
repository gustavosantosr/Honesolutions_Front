import { DocumentoClasificacion } from './documentoClasificacion';

export class DocumentoTipo {
    IDDocumentoTipo: number;
    DocumentoTipo: string;
    CampoRequerido: string;
    DocumentoClasificacion: DocumentoClasificacion;
    Activo: boolean;
    Vencimiento: boolean;
}
