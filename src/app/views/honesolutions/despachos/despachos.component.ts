import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Despacho } from '../../../model/despacho';
import { DespachoService } from '../../../services/despacho.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { DespachoEstado } from '../../../model/despachoEstado';
import { DespachoestadoService } from '../../../services/despachoestado.service';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';

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
  selector: 'app-despachos',
  templateUrl: './despachos.component.html',
  styleUrls: ['./despachos.component.scss']
})
export class DespachosComponent implements OnInit {
url='';
  public total = 0;
  public btn_update = false;
  public btn_add = true;
  public primaryModal;
  columns: any[];
  displayedColumns: string[];

  @Input() despacho: Despacho;

  despachoForm = new FormGroup({
    IDDespacho: new FormControl(''),
    IDDespachoEstado: new FormControl(''),
    IDCliente: new FormControl(''),
    FechaDespacho: new FormControl(''),
    IDUsuario: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<Despacho | Group>(this.getDespachos());
  despachos: Despacho[];
  despachoestados: DespachoEstado[];
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

  constructor(private despachoService: DespachoService, private authService: AuthService, private router: Router, private despachoestadoService: DespachoestadoService,
    private clienteService: ClienteService) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDDespacho'
      },
      {
        field: 'DespachoEstado'
      },
      {
        field: 'Cliente'
      },
      {
        field: 'FechaDespacho'
      },
      {
        field: 'Info'
      },
      {
        field: 'Imprimir'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.getDespachos();
    this.getDespachoestados();
    this.getClientes();
  }
  getDespacho(): void {
    this.despachoService.getDespacho(this.despachoForm.get('IDDespacho').value)
      .subscribe(despacho => this.despacho = despacho);
  }
  getDespachoestados() {
    this.despachoestadoService.getDespachoEstados()
      .subscribe(despachoestados => this.despachoestados = despachoestados);
    return this.despachoestados;
  }
  getClientes() {
    this.clienteService.getClientes()
      .subscribe(clientes => this.clientes = clientes);
    return this.clientes;
  }

  getDespachos() {

    this.despachoService.getDespachos()
      .subscribe(despachos => this.dataSource.data = despachos);



    return this.despachos;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/despachos-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDDespacho]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.despacho = row;
    this.despachoForm.controls['IDDespacho'].setValue(this.despacho.IDDespacho);
    this.despachoForm.controls['IDDespachoEstado'].setValue(this.despacho.DespachoEstado.IDDespachoEstado);
    this.despachoForm.controls['IDCliente'].setValue(this.despacho.Cliente.IDCliente);
    this.despachoForm.controls['FechaDespacho'].setValue(this.despacho.FechaDespacho);
    this.despachoForm.controls['IDUsuario'].setValue(this.authService.getId);
    this.btn_add = false;
    this.btn_update = true;
  }
  onRowClicked1(row) {

    this.url = 'https://honesolutions.herokuapp.com/generatePdf?IDDespacho=' + row.IDDespacho;
    window.open(this.url, 'popup', 'width=800,height=400,');

  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.despacho = this.despachoForm.value;
    // const id= this.despacho.IDDespacho;
    // this.despacho.IDDespacho=id;

    this.despachoService.updateDespacho(this.despacho)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();
    
    this.despacho = this.despachoForm.value;
    this.despacho.IDDespacho = null;
    this.despacho.IDUsuario = this.authService.getId;

    this.despachoService.addDespacho(this.despacho)
      .subscribe(data => {
        if (data) {

          this.getDespachos();
          this.despachoForm.reset();
        } else {
          // this.despachoForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getDespachos();
    this.despachoForm.reset();
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
    this.despacho = row;
    this.router.navigate(['/honesolutions/salidas/' + this.despacho.IDDespacho]);

  }

}