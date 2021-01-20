import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DespachoEstado } from '../../../model/despachoEstado';
import { DespachoestadoService } from '../../../services/despachoestado.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';

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
  selector: 'app-despachoestados',
  templateUrl: './despachoestados.component.html',
  styleUrls: ['./despachoestados.component.scss']
})
export class DespachoestadosComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];

  @Input() despachoestado: DespachoEstado;

  despachoestadoForm = new FormGroup({
    IDDespachoEstado: new FormControl(''),
    DespachoEstado: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<DespachoEstado | Group>(this.getDespachoestados());
  despachoestados: DespachoEstado[];

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

  constructor(private despachoestadoService: DespachoestadoService
    , private router: Router) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDDespachoEstado'
      },
      {
        field: 'DespachoEstado'
      }];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.getDespachoestados();
  }
  getDespachoestado(): void {
    this.despachoestadoService.getDespachoEstado(this.despachoestadoForm.get('IDDespachoEstado').value)
      .subscribe(despachoestado => this.despachoestado = despachoestado);
  }


  getDespachoestados() {

    this.despachoestadoService.getDespachoEstados()
      .subscribe(despachoestados => this.dataSource.data = despachoestados);



    return this.despachoestados;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/despachoestados-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDDespachoEstado]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.despachoestadoForm.setValue(row);
    this.btn_add = false;
    this.btn_update = true;
  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.despachoestado = this.despachoestadoForm.value;
    // const id= this.despachoestado.IDDespachoEstado;
    // this.despachoestado.IDDespachoEstado=id;

    this.despachoestadoService.updateDespachoEstado(this.despachoestado)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.despachoestado = this.despachoestadoForm.value;


    this.despachoestadoService.addDespachoEstado(this.despachoestado)
      .subscribe(data => {
        if (data) {

          this.getDespachoestados();
          this.despachoestadoForm.reset();
        } else {
          this.despachoestadoForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      });

  }
  cancel(): void {


    this.getDespachoestados();
    this.despachoestadoForm.reset();
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


