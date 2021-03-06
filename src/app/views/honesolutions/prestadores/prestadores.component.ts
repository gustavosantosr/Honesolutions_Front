import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Prestador } from '../../../model/prestador';
import { PrestadorService } from '../../../services/prestador.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu, MatSnackBar } from '@angular/material';
import { IdentificacionTipo } from '../../../model/identificacionTipo';
import { IdentificaciontipoService } from '../../../services/identificaciontipo.service';
import { Zonal } from '../../../model/zonal';
import { ZonalService } from '../../../services/zonal.service';
import { Ciudad } from '../../../model/ciudad';
import { CiudadService } from '../../../services/ciudad.service';
import { Departamento } from '../../../model/departamento';
import { DepartamentoService } from '../../../services/departamento.service';
import { Especialidad } from '../../../model/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario';
import { PrestadorTipo } from '../../../model/prestadorTipo';
import { PrestadortipoService } from '../../../services/prestadortipo.service';
import { Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
const keyify = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
@Component({
  selector: 'app-prestadores',
  templateUrl: './prestadores.component.html',
  styleUrls: ['./prestadores.component.scss']
})
export class PrestadoresComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  data = 2;
  idDepartamento = 0;
  displayedColumns: string[];
  especialidades: Especialidad[];
  @Input() prestador: Prestador;
  IDPrestador: number;
  prestadorForm = new FormGroup({
    IDPrestador: new FormControl(''),
    ComiteFecha: new FormControl('', [Validators.required]),
    Ciudad: new FormGroup({ // make a nested group
      IDCiudad: new FormControl('', [Validators.required])
    }),
    Zonal: new FormControl(''),
    IdentificacionTipo: new FormGroup({ // make a nested group
      IDIdentificacionTipo: new FormControl('', [Validators.required]),
      IdentificacionTipo: new FormControl(''),
      Activo: new FormControl(true)
    }),
    Identificacion: new FormControl('', [Validators.required]),
    Nombre: new FormControl('', [Validators.required]),
    ConsultorioDireccion: new FormControl(''),
    ConsultorioTelefono: new FormControl(''),
    Celular: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required,
    Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
    Servicios: new FormControl(''),
    Tarifas: new FormControl(''),
    Expediente: new FormControl('', [Validators.required]),
    Direccion: new FormControl(''),
    Verificado: new FormControl(true),
    PrestadorTipo: new FormGroup({ // make a nested group
      IDPrestadorTipo: new FormControl('', [Validators.required]),
      PrestadorTipo: new FormControl('')
    }),
    Cliente: new FormGroup({ // make a nested group
      IDCliente: new FormControl(1)
    }),
    Usuario: new FormGroup({ // make a nested group
      IDUsuario: new FormControl('', [Validators.required]),
      Email: new FormControl('')
    }),
    Notificacion: new FormControl(true),
    Error: new FormControl(''),
    TotalDocs: new FormControl(''),
    PendienteDocs: new FormControl(''),
    Departamento: new FormGroup({ // make a nested group
      IDDepartamento: new FormControl('', [Validators.required])
    }),
    Especialidad: new FormGroup({ // make a nested group
      IDEspecialidad: new FormControl('', [Validators.required]),
      Especialidad: new FormControl('')
    }),
    CelularOtro: new FormControl(''),
    EmailOtro: new FormControl('', [Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
    DV: new FormControl('', [Validators.required]),
    Activo: new FormControl(true)
  });

  get IDIdentificacionTipo() {
    return this.prestadorForm.get('IdentificacionTipo.IDIdentificacionTipo');
  }
  get IDPrestadorTipo() {
    return this.prestadorForm.get('PrestadorTipo.IDPrestadorTipo');
  }
  get IDEspecialidad() {
    return this.prestadorForm.get('Especialidad.IDEspecialidad');
  }
  get Expediente() {
    return this.prestadorForm.get('Expediente');
  }
  get IDUsuario() {
    return this.prestadorForm.get('Usuario.IDUsuario');
  }
  get Identificacion() {
    return this.prestadorForm.get('Identificacion');
  }
  get DV() {
    return this.prestadorForm.get('DV');
  }
  get Nombre() {
    return this.prestadorForm.get('Nombre');
  }
  get ComiteFecha() {
    return this.prestadorForm.get('ComiteFecha');
  }
  get IDDepartamento() {
    return this.prestadorForm.get('Departamento.IDDepartamento');
  }
  get IDCiudad() {
    return this.prestadorForm.get('Ciudad.IDCiudad');
  }
  get Celular() {
    return this.prestadorForm.get('Celular');
  }
  get Email() {
    return this.prestadorForm.get('Email');
  }
  get EmailOtro() {
    return this.prestadorForm.get('EmailOtro');
  }



  _alldata: any[];
  dataSource = new MatTableDataSource<Prestador | Group>(this.getPrestadores());
  prestadores: Prestador[];
  identificaciontipos: IdentificacionTipo[];
  zonales: Zonal[];
  ciudades: Ciudad[];
  departamentos: Departamento[];
  usuarios: Usuario[];
  prestadortipos: PrestadorTipo[];


  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  groupByColumns: string[] = [];
  barcodeValue;

  AfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }




  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();





  }

  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService, private ciudadService: CiudadService, private departamentoService: DepartamentoService,
    private prestadorService: PrestadorService, private router: Router,
    private identificaciontipoService: IdentificaciontipoService,
    private especialidadService: EspecialidadService,
    private prestadortipoService: PrestadortipoService,
    private usuarioService: UsuarioService,
    private zonalService: ZonalService) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDPrestador'
      },
      {
        field: 'IdentificacionTipo'
      },
      {
        field: 'Identificacion'
      },
      {
        field: 'Nombre'
      },
      {
        field: 'Email'
      },
      {
        field: 'TelefonoContacto'
      },
      {
        field: 'Usuario'

      },
      {
        field: 'Completado'
      },
      {
        field: 'docs'
      },
      {
        field: 'especialidades'
      },
      {
        field: 'tarifas'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.spinner.show();
    this.IDPrestador = 1;
    this.getPrestadores();
    this.getIdentificaciontipos();
    this.getPrestadortipos();
    this.getZonals();
    this.getDepartamentos();
    this.getEspecialidades();
    this.getUsuarios();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getPrestador(): void {
    this.prestadorService.getPrestador(this.prestadorForm.get('IDPrestador').value)
      .subscribe(prestador => this.prestador = prestador);
  }
  getDepartamentos() {

    this.departamentoService.getDepartamentosActivos()
      .subscribe(departamentos => this.departamentos = departamentos);



    return this.departamentos;
  }
  docRequeridos(row): void {
    this.router.navigate(['honesolutions/documentorequeridos/' + row.IDPrestador + '/' + row.Nombre]);
  }
  dirEspecialidades(row): void {
    this.router.navigate(['honesolutions/prestadorespecialidades/' + row.IDPrestador]);
  }
  getUsuarios() {

    this.usuarioService.getUsuarios()
      .subscribe(usuarios => this.usuarios = usuarios);



    return this.usuarios;
  }
  getEspecialidades() {

    this.especialidadService.getEspecialidades()
      .subscribe(especialidades => this.especialidades = especialidades);



    return this.departamentos;
  }
  getIdentificaciontipos() {
    this.identificaciontipoService.getIdentificacionTiposActivo()
      .subscribe(identificaciontipos => this.identificaciontipos = identificaciontipos);
    return this.identificaciontipos;
  }
  getPrestadortipos() {
    this.prestadortipoService.getPrestadorTipos()
      .subscribe(prestadortipos => this.prestadortipos = prestadortipos);
    return this.prestadortipos;
  }
  changeDepartamento() {
    this.idDepartamento = this.prestadorForm.controls['Departamento'].value.IDDepartamento;
    this.ciudadService.getCiudadbyDepartamento(this.idDepartamento)
      .subscribe(ciudades => this.ciudades = ciudades,
        err => {
          alert(err);
        },
        () => {

        });

    return this.ciudades;
  }
  getZonals() {
    this.zonalService.getZonales()
      .subscribe(zonales => this.zonales = zonales);
    return this.zonales;
  }

  getPrestadores() {

    this.prestadorService.getPrestadores()
      .subscribe(prestadores => this.dataSource.data = prestadores,
        err => {
          console.log(err);
        },
        () => {
          this.spinner.hide();
        });



    return this.prestadores;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/prestadores-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDPrestador]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    // this.prestadorForm.controls['Departamento']['IDDepartamento'].setValue(row.Departamento.IDDepartamento);
    // this.prestadorForm.controls['Departamento'].setValue(row.Departamento.IDDepartamento);
   
    this.markControlsDirty(this.prestadorForm, row);

    //this.prestadores = row;
    //console.log(Object.keys(this.prestadorForm.controls));
    // Object.keys(this.prestadorForm.controls).forEach(key => {
    // this.prestadorForm.controls[key].setValue(1);
    //});
    //this.IDPrestador = row.IDPrestador;
    //this.prestadorForm.setValue(row);
    //this.changeDepartamento();


    //this.prestadorForm.controls['Ciudad.IDCiudad'].setValue(row.Ciudad.IDCiudad);
    //this.prestadorForm.get(['Ciudad', 'IDCiudad']).setValue(row.Ciudad.IDCiudad);
    // this.prestador = row;
    //  this.prestadorForm.controls['IDPrestador'].setValue(this.prestador.IDPrestador);
    //  this.prestadorForm.controls['IDIdentificacionTipo'].setValue(this.prestador.IdentificacionTipo.IDIdentificacionTipo);
    // this.prestadorForm.controls['Identificacion'].setValue(this.prestador.Identificacion);
    // this.prestadorForm.controls['Email'].setValue(this.prestador.Email);
    // this.prestadorForm.controls['Direccion'].setValue(this.prestador.Direccion);
    this.idDepartamento = row.Departamento.IDDepartamento;
    this.changeDepartamento();
    this.btn_add = false;
    this.btn_update = true;
  }
  public markControlsDirty(group: FormGroup | FormArray, values: Prestador[]): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      const valor = values[key];

      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.markControlsDirty(abstractControl, valor);
      } else {
        abstractControl.setValue(valor);
      }
    });
  }

  onRowClicked1(row) {
    this.prestadorService.setPrestardorID(row.IDPrestador);
    this.data = row.IDPrestador;
    console.log('Row clicked: ', row);
  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.prestador = this.prestadorForm.value;
    // const id= this.prestador.IDPrestador;
    // this.prestador.IDPrestador=id;

    this.prestadorService.updatePrestador(this.prestador)
      .subscribe(() => this.cancel());

  }
  mensaje() {
    this.toastr.success('Hone Solutions!', 'El registro fue Exitoso!');
  }
  save(): void {
    // event.preventDefault();

    this.prestador = this.prestadorForm.value;
    this.prestador.IDPrestador = null;

    this.prestadorService.addPrestador(this.prestador)
      .subscribe(data => {
        if (data) {
          // window.alert('El prestador se creo correctamente');
          this.toastr.success('Hone Solutions!', 'El registro fue Exitoso!');
          this.getPrestadores();
          this.prestadorForm.reset();
        } else {
          // this.prestadorForm.reset();
          this.toastr.error('Hone Solutions!', 'No se pudo registrar el elemento');
          // window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getPrestadores();
    this.prestadorForm.reset();
    this.btn_add = true;
    this.btn_update = false;


  }
  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this.dataSource.data, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this.dataSource.data, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }
  info(row) {
    console.log('Row clicked: ', row);
    this.prestador = row;
    this.router.navigate(['/honesolutions/representantes/' + this.prestador.IDPrestador]);

  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.prestadorForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    alert(invalid);
    return invalid;
  }

}
