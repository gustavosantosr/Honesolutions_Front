import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmMarker } from '@agm/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Programa } from '../../../model/programa';
import { ProgramacionDto } from '../../../dtos/programacionDto';
import { MapaService } from '../../../services/mapa.service';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../../model/vehiculo';
import { VehiculoService } from '../../../services/vehiculo.service';
import { Conductor } from '../../../model/conductor';
import { ConductorService } from '../../../services/conductor.service';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { ServicioTipo } from '../../../model/servicioTipo';
import { ServiciotipoService } from '../../../services/serviciotipo.service';
import { AuthService } from '../../../services/auth.service';
import { ProgramacionService } from '../../../services/programacion.service';

@Component({
  selector: 'app-trayectos',
  templateUrl: './trayectos.component.html',
  styleUrls: ['./trayectos.component.scss']
})
export class TrayectosComponent implements OnInit {
  title = 'AGM project';
  vehiculos: Vehiculo[];
  conductores: Conductor[];
  clientes: Cliente[];
  programacionDtos: ProgramacionDto;
  serviciotipos: ServicioTipo[];
  private geocoder: any;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  latitude2: number;
  longitude2: number;
  address2: string;
  programas: Programa[];
  result: any;
  private geoCoder;
  private dir;
  @Input() programa: Programa;
  programaForm = new FormGroup({
    IDVehiculo: new FormControl(''),
    IDConductor: new FormControl(''),
    IDServicioTipo: new FormControl(''),
    FechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    HoraInicio: new FormControl(''),
    HoraFin: new FormControl(''),
    Valor: new FormControl(''),
    DireccionOrigen: new FormControl(''),
    DireccionDestino: new FormControl(''),
    LatitudOrigen: new FormControl(''),
    LongOrigen: new FormControl(''),
    LatitudDestino: new FormControl(''),
    LongDestino: new FormControl(''),
    IDUsuario: new FormControl(''),
    CantidadPasajeros: new FormControl(''),
    IDCliente: new FormControl(''),
    NombrePasajero: new FormControl(''),
    CelularPasajero: new FormControl('')
  });

  @ViewChild('search', { static: false })
  public searchElementRef: ElementRef;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private vehiculoService: VehiculoService,
    private conductorService: ConductorService,
    private clienteService: ClienteService,
    private serviciotipoService: ServiciotipoService,
    private authService: AuthService,
    private programacionService: ProgramacionService,
    private mapaService: MapaService
  ) { }


  ngOnInit() {
    // load Places Autocomplete
    this.getVehiculos();
    this.getConductores();
    this.getClientes();
    this.getServiciotipos();
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      this.dir = new google.maps.DirectionsService;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.latitude2 = place.geometry.location.lat();
          this.longitude2 = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  getVehiculos() {

    this.vehiculoService.getVehiculos()
      .subscribe(vehiculos => this.vehiculos = vehiculos);



    return this.vehiculos;
  }
  getConductores() {

    this.conductorService.getConductores()
      .subscribe(conductores => this.conductores = conductores);



    return this.conductores;
  }
  getClientes() {

    this.clienteService.getClientes()
      .subscribe(clientes => this.clientes = clientes);



    return this.clientes;
  }
  getServiciotipos() {

    this.serviciotipoService.getServicioTipos()
      .subscribe(serviciotipos => this.serviciotipos = serviciotipos);



    return this.serviciotipos;
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.latitude2 = position.coords.latitude;
        this.longitude2 = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  markerDragEnd2($event: MouseEvent) {
    console.log($event);
    this.latitude2 = $event.coords.lat;
    this.longitude2 = $event.coords.lng;
    this.getAddress2(this.latitude2, this.longitude2);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.programaForm.controls['DireccionOrigen'].setValue(this.address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  getAddress2(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address2 = results[0].formatted_address;
          this.programaForm.controls['DireccionDestino'].setValue(this.address2);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  getCoords() {
    alert(this.programaForm.get('DireccionOrigen').value);
    this.programaForm.reset();
    this.geoCoder.geocode({ 'address': ' calle 7 A bis b # 72 - 73' }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0];
          alert(results[0].formatted_address);
          // alert(results[0].results.formatted_address);
          alert(results[0].geometry.location.lat);
          alert(results[0].geometry.location.lng);
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  gerCordsOrigen() {
    alert(this.programaForm.get('DireccionOrigen').value);
    const direccion = this.programaForm.get('DireccionOrigen').value;
    this.mapaService.getDireccion(direccion)
      .subscribe(result => this.result = result,
        err => {
          alert(err);
        },
        () => {
          if (this.result != null) {
            alert(this.result);
            console.log(JSON.stringify(this.result));
            // alert(this.programas);

            alert(this.result.results[0].formatted_address);
            alert(this.result.results[0].geometry.location.lat);
            alert(this.result.results[0].geometry.location.lng);
            this.latitude = this.result.results[0].geometry.location.lat;
            this.longitude = this.result.results[0].geometry.location.lng;
          } else {
            window.alert('Los datos suministrados son incorrectos');
          }
        });
  }
  gerCordsDestino() {
    alert(this.programaForm.get('DireccionDestino').value);
    const direccion = this.programaForm.get('DireccionDestino').value;
    this.mapaService.getDireccion(direccion)
      .subscribe(result => this.result = result,
        err => {
          alert(err);
        },
        () => {
          if (this.result != null) {
            alert(this.result);
            console.log(JSON.stringify(this.result));
            // alert(this.programas);

            alert(this.result.results[0].formatted_address);
            alert(this.result.results[0].geometry.location.lat);
            alert(this.result.results[0].geometry.location.lng);
            this.latitude2 = this.result.results[0].geometry.location.lat;
            this.longitude2 = this.result.results[0].geometry.location.lng;
          } else {
            window.alert('Los datos suministrados son incorrectos');
          }
        });
  }
  getGeoLocation(address: string): Observable<any> {
    address = ' calle 7 a bis b # 72 - 73';
    console.log('Getting address: ', address);

    return Observable.create(observer => {
      this.geoCoder.geocode({
        'address': address
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          observer.next(results[0].geometry.location);
          observer.complete();
          alert(results[0].geometry.location);
        } else {
          alert('Error: ' + results + ' & Status: ' + status);
          console.log('Error: ', results, ' & Status: ', status);
          observer.error();
        }
      });
    });
  }

  save(): void {
    // event.preventDefault();

    this.programacionDtos = this.programaForm.value;
    this.programacionDtos.IDUsuario = this.authService.getId;
    this.programacionDtos.LatitudDestino = this.latitude2;
    this.programacionDtos.LatitudOrigen = this.latitude;
    this.programacionDtos.LongOrigen = this.longitude;
    this.programacionDtos.LongDestino = this.longitude2;
    this.programacionDtos.FechaInicio = this.programaForm.get('FechaInicio').value + ' ' + this.programaForm.get('HoraInicio').value;
    this.programacionDtos.FechaFin = this.programaForm.get('FechaFin').value + ' ' + this.programaForm.get('HoraFin').value;
    // alert(JSON.stringify(this.programacionDtos));

    this.programacionService.addProgramacion(this.programacionDtos)
      .subscribe(data => {
        if (data) {


          this.programaForm.reset();
        } else {
          // this.programaForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      });

  }

}
