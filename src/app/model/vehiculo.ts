import { Propietario } from './propietario';
import { VehiculoReferencia } from './vehiculoReferencia';
import { VehiculoMarca } from './vehiculoMarca';
import { VehiculoTipo } from './vehiculoTipo';

export class Vehiculo {
    IDVehiculo: number;
    Propietario: Propietario;
    VehiculoReferencia: VehiculoReferencia;
    VehiculoMarca: VehiculoMarca;
    VehiculoTipo: VehiculoTipo;
    Placa: string;
    FechaRegistro: string;


}
