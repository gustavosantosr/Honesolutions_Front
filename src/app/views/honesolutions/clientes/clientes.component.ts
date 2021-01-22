import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { IdentificacionTipo } from '../../../model/identificacionTipo';
import { IdentificaciontipoService } from '../../../services/identificaciontipo.service';
import { CuentaTipo } from '../../../model/cuentaTipo';
import { CuentatipoService } from '../../../services/cuentatipo.service';
import { Ciudad } from '../../../model/ciudad';
import { CiudadService } from '../../../services/ciudad.service';
import { Departamento } from '../../../model/departamento';
import { DepartamentoService } from '../../../services/departamento.service';

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];

  @Input() cliente: Cliente;

  clienteForm = new FormGroup({
    IDCliente: new FormControl(''),
    IDDepartamento: new FormControl('', [Validators.required]),
    Nombres: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, 
               Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
    Direccion: new FormControl('', [Validators.required]),
    Telefono: new FormControl('', [Validators.required]),
    Celular: new FormControl('', [Validators.required]),
    Ciudad: new FormGroup({ // make a nested group
      IDCiudad: new FormControl('', [Validators.required]),
      Ciudad: new FormControl(''),
      Active: new FormControl(true)
    }),
    IdentificacionTipo: new FormGroup({ // make a nested group
      IDIdentificacionTipo: new FormControl('', [Validators.required]),
      IdentificacionTipo: new FormControl(''),
      Active: new FormControl(true)
    }),
    Identificacion: new FormControl('', [Validators.required]),
    DV: new FormControl('', [Validators.required]),
    ActividadRut: new FormControl(''),
    ActividadCodigo: new FormControl(''),
    Banco: new FormControl(''),
    CuentaTipo: new FormGroup({ // make a nested group
      IDCuentaTipo: new FormControl(''),
      CuentaTipo: new FormControl(''),
      Active: new FormControl(true)
    }),
    Activo: new FormControl(true),
    CelularOtro: new FormControl(''),
    EmailOtro: new FormControl('', [Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')])
  });

  get IDIdentificacionTipo() {   
    return this.clienteForm.get('IDIdentificacionTipo');
    }
  get Identificacion() {   
  return this.clienteForm.get('Identificacion');
  }
  get DV() {   
  return this.clienteForm.get('DV');
  }
  get Nombres() {   
    return this.clienteForm.get('Nombres');
  }
  get Email() {   
    return this.clienteForm.get('Email');
  }
  get IDDepartamento() {   
    return this.clienteForm.get('IDDepartamento');
  }
  get IDCiudad() {   
    return this.clienteForm.get('IDCiudad');
  }
  get Direccion() {   
    return this.clienteForm.get('Direccion');
  }
  get Telefono() {   
    return this.clienteForm.get('Telefono');
  }
  get Celular() {   
    return this.clienteForm.get('Celular');
  }
  get EmailOtro() {   
    return this.clienteForm.get('EmailOtro');
  }



  _alldata: any[];
  dataSource = new MatTableDataSource<Cliente | Group>(this.getClientes());
  clientes: Cliente[];
  identificaciontipos: IdentificacionTipo[];
  cuentatipos: CuentaTipo[];
  ciudades: Ciudad[];
  departamentos: Departamento[];

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

  constructor(private ciudadService: CiudadService, private departamentoService: DepartamentoService,
    private clienteService: ClienteService, private router: Router,
    private identificaciontipoService: IdentificaciontipoService,
    private cuentatipoService: CuentatipoService) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDCliente'
      },
      {
        field: 'IdentificacionTipo'
      },
      {
        field: 'Identificacion'
      },
      {
        field: 'Nombres'
      },
      {
        field: 'Email'
      },
      {
        field: 'Celular'
      },
      {
        field: 'Direccion'
      },
      {
        field: 'Activo'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.getClientes();
    this.getIdentificaciontipos();
    this.getCuentatipos();
    this.getDepartamentos();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getCliente(): void {
    this.clienteService.getCliente(this.clienteForm.get('IDCliente').value)
      .subscribe(cliente => this.cliente = cliente);
  }
  getDepartamentos() {

    this.departamentoService.getDepartamentos()
      .subscribe(departamentos => this.departamentos = departamentos);



    return this.departamentos;
  }
  getIdentificaciontipos() {
    this.identificaciontipoService.getIdentificacionTipos()
      .subscribe(identificaciontipos => this.identificaciontipos = identificaciontipos);
    return this.identificaciontipos;
  }
  changeDepartamento() {
    
    const id = this.clienteForm.controls['IDDepartamento'].value;
    
    this.ciudadService.getCiudadbyDepartamento(id)
      .subscribe(ciudades => this.ciudades = ciudades,
        err => {
          alert(err);
        },
        () => {

        });

    return this.ciudades;
  }
  getCuentatipos() {
    this.cuentatipoService.getCuentaTipos()
      .subscribe(cuentatipos => this.cuentatipos = cuentatipos);
    return this.cuentatipos;
  }

  getClientes() {

    this.clienteService.getClientes()
      .subscribe(clientes => this.dataSource.data = clientes);
    return this.clientes;
  }
  getClientesActivo() {

    this.clienteService.getClientesActivo()
      .subscribe(clientes => this.dataSource.data = clientes);
    return this.clientes;
  }
  getClientesInactivo() {

    this.clienteService.getClientesInactivo()
      .subscribe(clientes => this.dataSource.data = clientes);
    return this.clientes;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/clientes-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDCliente]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.cliente = row;
    this.clienteForm.controls['IDCliente'].setValue(this.cliente.IDCliente);
    this.clienteForm.controls.IdentificacionTipo.controls['IDIdentificacionTipo'].setValue(this.cliente.IdentificacionTipo.IDIdentificacionTipo);
    this.clienteForm.controls['Identificacion'].setValue(this.cliente.Identificacion);
    this.clienteForm.controls['DV'].setValue(this.cliente.DV);
    this.clienteForm.controls['Nombres'].setValue(this.cliente.Nombres);
    this.clienteForm.controls['Email'].setValue(this.cliente.Email);
    this.clienteForm.controls.Ciudad.controls['IDCiudad'].setValue(this.cliente.Ciudad.IDCiudad);
    this.clienteForm.controls['Direccion'].setValue(this.cliente.Direccion);
    this.clienteForm.controls['Telefono'].setValue(this.cliente.Telefono);
    this.clienteForm.controls['Celular'].setValue(this.cliente.Celular);
    this.btn_add = false;
    this.btn_update = true;
  }
 
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.cliente = this.clienteForm.value;
    // const id= this.cliente.IDCliente;
    // this.cliente.IDCliente=id;

    this.clienteService.updateCliente(this.cliente)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.cliente = this.clienteForm.value;
    this.cliente.IDCliente = null;

    this.clienteService.addCliente(this.cliente)
      .subscribe(data => {
        if (data) {

          this.getClientes();
          this.clienteForm.reset();
        } else {
          // this.clienteForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getClientes();
    this.clienteForm.reset();
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
    this.cliente = row;
    this.router.navigate(['/honesolutions/representantes/' + this.cliente.IDCliente]);

  }

}