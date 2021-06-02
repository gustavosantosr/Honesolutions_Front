import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// componentes creados//
import { DocumentoTiposComponent } from './documentotipos/documentotipos.component';
import { TrayectosComponent } from './trayectos/trayectos.component';
import { VehiculotiposComponent } from './vehiculotipos/vehiculotipos.component';
import { VehiculomarcasComponent } from './vehiculomarcas/vehiculomarcas.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ConductorDetailComponent } from './conductor-detail/conductor-detail.component';
import { RepresentantesComponent } from './representantes/representantes.component';
import { ServiciotiposComponent } from './serviciotipos/serviciotipos.component';
import { PiezasComponent } from './piezas/piezas.component';
import { DespachoestadosComponent } from './despachoestados/despachoestados.component';
import { DespachosComponent } from './despachos/despachos.component';
import { SalidasComponent } from './salidas/salidas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InformesComponent } from './informes/informes.component';
import { RolesComponent } from './roles/roles.component';
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
import { IdentificaciontiposComponent } from './identificaciontipos/identificaciontipos.component';
import { ConfiglocalizacionesComponent } from './configlocalizaciones/configlocalizaciones.component';
import { ConfigprestadoresComponent } from './configprestadores/configprestadores.component';
import { PrestadoresgestorComponent } from './prestadoresgestor/prestadoresgestor.component';
import { ReportesComponent } from './reportes/reportes.component';
import { PrestadorespecialidadesComponent } from './prestadorespecialidades/prestadorespecialidades.component';
import { PrestadorestarifasComponent } from './prestadorestarifas/prestadorestarifas.component';
import { WizardprestadorComponent } from './wizardprestador/wizardprestador.component';
import { TarifaipsComponent } from './tarifaips/tarifaips.component';
import { TarifasprestadorComponent } from './tarifasprestador/tarifasprestador.component';





const routes: Routes = [
  {
    path: '',
    component: DocumentoTiposComponent,
    data: {
      title: 'Tipos de Documentos'
    }
  },
  { path: 'roles', component: RolesComponent },
  { path: 'documentotipos', component: DocumentoTiposComponent },
  { path: 'actividadtipos', component: ActividadTiposComponent },
  { path: 'conductor-detail/:id', component: ConductorDetailComponent},
  { path: 'clientes', component: ClientesComponent },
  { path: 'representantes/:id', component: RepresentantesComponent },
  { path: 'prestadorplanes', component: PrestadorPlanesComponent },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'prestadortipos', component: PrestadorTiposComponent },
  { path: 'identificaciontipos', component: IdentificaciontiposComponent },
  { path: 'prestadores', component: PrestadoresComponent },
  { path: 'documentorequeridos/:id/:name', component: DocumentoRequeridosComponent },
  { path: 'dynamic-form', component: DynamicFormComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: 'tarifas', component: TarifasComponent },
  { path: 'servicioespecialidades', component: ServicioespecialidadesComponent },
  { path: 'ciudades', component: CiudadesComponent },
  { path: 'vehiculotipos', component: VehiculotiposComponent },
  { path: 'vehiculomarcas', component: VehiculomarcasComponent },
  { path: 'despachoestados', component: DespachoestadosComponent },
  { path: 'despachos', component: DespachosComponent },
  { path: 'salidas/:id', component: SalidasComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'piezas', component: PiezasComponent },
  { path: 'informes', component: InformesComponent },
  { path: 'configlocalizaciones', component: ConfiglocalizacionesComponent },
  { path: 'configprestadores', component: ConfigprestadoresComponent },
  { path: 'prestadoresgestor', component: PrestadoresgestorComponent},
  { path: 'prestadorespecialidades/:id', component: PrestadorespecialidadesComponent},
  { path: 'prestadorestarifas/:id', component: PrestadorestarifasComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'wizard', component: WizardprestadorComponent},
  { path: 'tarifasips', component: TarifaipsComponent},
  { path: 'tarifasprestador', component: TarifasprestadorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class honesolutionsRoutingModule {}
