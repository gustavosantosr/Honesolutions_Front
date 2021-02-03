import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';



import { honesolutionsRoutingModule } from './honesolutions-routing.module';

import { HttpClientModule } from '@angular/common/http';
// tslint:disable-next-line:max-line-length
import {
  MatInputModule,  MatProgressSpinnerModule,
  MatSortModule, MatTableModule, MatIconModule, MatMenuModule, MatPaginatorModule, MatSnackBar, MatSnackBarModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
import { DocumentoTiposComponent } from './documentotipos/documentotipos.component';
import { SangretiposComponent } from './sangretipos/sangretipos.component';
import { ConductoresComponent } from './conductores/conductores.component';
import { TrayectosComponent } from './trayectos/trayectos.component';
import { PropietariosComponent } from './propietarios/propietarios.component';
import { VehiculotiposComponent } from './vehiculotipos/vehiculotipos.component';
import { VehiculomarcasComponent } from './vehiculomarcas/vehiculomarcas.component';
import { AgmCoreModule } from '@agm/core';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ConductorDetailComponent } from './conductor-detail/conductor-detail.component';
import { RepresentantesComponent } from './representantes/representantes.component';
import { ServiciotiposComponent } from './serviciotipos/serviciotipos.component';
import { PiezasComponent } from './piezas/piezas.component';
import { DespachoestadosComponent } from './despachoestados/despachoestados.component';
import { SalidasComponent } from './salidas/salidas.component';
import { DespachosComponent } from './despachos/despachos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HighlightSearchPipe } from './highlightable-search.pipe';
import { InformesComponent } from './informes/informes.component';
import { WebDataRocksPivot } from '../webdatarocks/webdatarocks.angular4';
import { RolesComponent } from './roles/roles.component';
import { PermisosComponent } from './permisos/permisos.component';
import { ActividadTiposComponent } from './actividadtipos/actividadtipos.component';
import { PrestadorPlanesComponent } from './prestadorplanes/prestadorplanes.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { PrestadorTiposComponent } from './prestadortipos/prestadortipos.component';
import { CiudadesComponent } from './ciudades/ciudades.component';
import { PrestadoresComponent } from './prestadores/prestadores.component';
import { DocumentoRequeridosComponent } from './documentorequeridos/documentorequeridos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ServicioespecialidadesComponent } from './servicioespecialidades/servicioespecialidades.component';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { DynamicFormComponent } from './documentorequeridos/dynamic-form.component';
import { DynamicFormQuestionComponent } from './documentorequeridos/dynamic-form-question.component';
import { IdentificaciontiposComponent } from './identificaciontipos/identificaciontipos.component';
import { ConfiglocalizacionesComponent } from './configlocalizaciones/configlocalizaciones.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ConfigprestadoresComponent } from './configprestadores/configprestadores.component';

// Tooltip Component
import { TooltipsComponent } from '../base/tooltips.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PrestadoresgestorComponent } from './prestadoresgestor/prestadoresgestor.component';





@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    FormsModule,
    honesolutionsRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    TooltipModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDw7fcF8mx_xw-3v2jRnYwsYnkyMGdBKnA',
      libraries: ['places']
    })
  ],
  declarations: [
    DocumentoTiposComponent,
    SangretiposComponent,
    ConductoresComponent,
    TrayectosComponent,
    PropietariosComponent,
    VehiculotiposComponent,
    VehiculomarcasComponent,
    VehiculosComponent,
    ClientesComponent,
    ConductorDetailComponent,
    RepresentantesComponent,
    ServiciotiposComponent,
    PiezasComponent,
    DespachoestadosComponent,
    SalidasComponent,
    DespachosComponent,
    UsuariosComponent,
    HighlightSearchPipe,
    InformesComponent,
    WebDataRocksPivot,
    RolesComponent,
    PermisosComponent,
    ActividadTiposComponent,
    PrestadorPlanesComponent,
    DepartamentosComponent,
    PrestadorTiposComponent,
    CiudadesComponent,
    PrestadoresComponent,
    DocumentoRequeridosComponent,
    ServiciosComponent,
    ServicioespecialidadesComponent,
    EspecialidadesComponent,
    TarifasComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent,
    IdentificaciontiposComponent,
    ConfiglocalizacionesComponent,
    ConfigprestadoresComponent,
    TooltipsComponent,
    PrestadoresgestorComponent

  ],
  providers: [
    MatSnackBar,
    HighlightSearchPipe
  ],
})
export class honesolutionsModule { }
