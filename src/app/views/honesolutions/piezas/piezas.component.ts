import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Pieza } from '../../../model/pieza';
import { PiezaService } from '../../../services/pieza.service';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { ServiciotipoService } from '../../../services/serviciotipo.service';
import { AuthService } from '../../../services/auth.service';
import { ServicioTipo } from '../../../model/servicioTipo';

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
  selector: 'app-piezas',
  templateUrl: './piezas.component.html',
  styleUrls: ['./piezas.component.scss']
})
export class PiezasComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];
  url: string;
  @Input() pieza: Pieza;

  piezaForm = new FormGroup({
    IDPieza: new FormControl(''),
    IDCliente: new FormControl(''),
    IDServicioTipo: new FormControl(''),
    Numero: new FormControl(''),
    Lote: new FormControl(''),
    Descripcion: new FormControl(''),
    MetrosRecibidos: new FormControl(''),
    MetrosEntregados: new FormControl(''),
    Observaciones: new FormControl(''),
    IDUsuario: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<Pieza | Group>(this.getPiezas());
  piezas: Pieza[];
  serviciotipos: ServicioTipo[];
  clientes: Cliente[];
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

  constructor(private piezaService: PiezaService
    , private serviciotipoService: ServiciotipoService, private router: Router, private authService: AuthService,
    private clienteService: ClienteService) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'Numero'
      },
      {
        field: 'Codigo'
      },
      {
        field: 'Cliente'
      },
      {
        field: 'Lote'
      },
      {
        field: 'ServicioTipo'
      },
      {
        field: 'Descripcion'
      },
      {
        field: 'MetrosRecibidos'
      },
      {
        field: 'FechaRegistro'
      },
      {
        field: 'Observaciones'
      }];
    this.displayedColumns = this.columns.map(column => column.field);

  }

  getServiciotipos() {

    this.serviciotipoService.getServicioTipos()
      .subscribe(serviciotipos => this.serviciotipos = serviciotipos);



    return this.serviciotipos;
  }
  ngOnInit() {
    this.getPiezas();
    this.getServiciotipos();
    this.getClientes();
  }
  


  getPiezas() {

    this.piezaService.getPiezas()
      .subscribe(piezas => this.dataSource.data = piezas);



    return this.piezas;
  }

  getClientes() {

    this.clienteService.getClientes()
      .subscribe(clientes => this.clientes = clientes);



    return this.clientes;
  }


  select(id: number): void {
    this.router.navigate(['proveedores/piezas-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDPieza]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    this.pieza = row;
    this.piezaForm.controls['IDCliente'].setValue(this.pieza.Cliente.IDCliente);
    this.piezaForm.controls['IDServicioTipo'].setValue(this.pieza.ServicioTipo.IDServicioTipo);
    this.piezaForm.controls['Numero'].setValue(this.pieza.Numero);
    this.piezaForm.controls['Lote'].setValue(this.pieza.Lote);
    this.piezaForm.controls['Descripcion'].setValue(this.pieza.Descripcion);
    this.piezaForm.controls['Observaciones'].setValue(this.pieza.Observaciones);
    this.piezaForm.controls['MetrosRecibidos'].setValue(this.pieza.MetrosRecibidos);
    this.piezaForm.controls['IDUsuario'].setValue(this.authService.getId);
    this.piezaForm.controls['IDPieza'].setValue(this.pieza.IDPieza);
    //this.piezaForm.setValue(this.pieza);
    //this.piezaForm.controls['IDCliente'].setValue(this.pieza.Cliente.IDCliente);
    this.btn_add = false;
    this.btn_update = true;
  }

  onRowClicked1(row) {

    this.url = 'https://drmonkey.co/daltex/imprimir_honesolutions.php?codigo=' + row.Codigo + '&cliente=' + row.Cliente.RazonSocial + '&numero=' + row.Numero + '&servicio=' + row.ServicioTipo.ServicioTipo + '&observaciones=' + row.Observaciones + '&metros=' + row.MetrosRecibidos + '&lote=' + row.Lote + '&valor=1';
    window.open(this.url, 'popup', 'width=800,height=400,');

  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.pieza = this.piezaForm.value;
    // const id= this.pieza.IDPieza;
    // this.pieza.IDPieza=id;

    this.piezaService.updatePieza(this.pieza)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.pieza = this.piezaForm.value;
    this.pieza.IDPieza = null;
    this.pieza.IDUsuario = this.authService.getId;

    this.piezaService.addPieza(this.pieza)
      .subscribe(data => {
        if (data) {

          this.getPiezas();
          this.piezaForm.reset();
        } else {
          this.piezaForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      });

  }
  cancel(): void {


    this.getPiezas();
    this.piezaForm.reset();
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

}


