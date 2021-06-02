import { AfterViewInit, Component, OnInit, Output, Input, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ciudad } from '../../../model/ciudad';
import { CiudadService } from '../../../services/ciudad.service';
import { TarifaPrestador, TarifaServicio } from '../../../model/tarifa';
import { TarifaService } from '../../../services/tarifa.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { Validators } from '@angular/forms';



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
  selector: 'app-prestadorestarifas',
  templateUrl: './prestadorestarifas.component.html',
  styleUrls: ['./prestadorestarifas.component.scss']
})
export class PrestadorestarifasComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];
  @Input()
  jsonData: number;
  prestadortarifas: TarifaServicio[];
  @Input() prestadortarifa: TarifaServicio;
  @Input() prestadortarifaUpdate: TarifaPrestador;

  prestadortarifaForm = new FormGroup({
    IDEspecialidad: new FormControl(''),
    IDPrestador: new FormControl('')
  });

  get Prestadortarifa() {
    return this.prestadortarifaForm.get('Prestadortarifa');
  }

  get Codigo() {
    return this.prestadortarifaForm.get('Codigo');
  }


  _alldata: any[];
  dataSource = new MatTableDataSource<TarifaServicio | Group>(this.getPrestadortarifa());
  tarifas: TarifaServicio[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  groupByColumns: string[] = [];
  barcodeValue;
  filterText: string;
  @Input()
  id_param: number;

  AfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }




  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: TarifaServicio, filter: string) => {
      return data.IDPrestador.toString().toLocaleLowerCase().includes(filter) ||
        data.Servicio.Descripcion3495.toString().toLocaleLowerCase().includes(filter) ||
        data.Care.toString().toLocaleLowerCase().includes(filter);
    }
    this.filterText = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterText;
  }
  applyFilter1(filterValue: string) {
    this.dataSource.filterPredicate = (data: TarifaServicio, filter: string) => {
      return data.Realizacion.toString().toLocaleLowerCase().includes(filter);
    }

    this.filterText = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterText;
  }
  

  constructor(private tarifaService: TarifaService
    , private router: Router, private route: ActivatedRoute) {

    this.columns = [

      {
        field: 'Activo'
      },
      {
        field: 'Resolucion3495'
      },
      {
        field: 'Descripcion3495'
      }
      ,
      {
        field: 'Uvr'
      },
      {
        field: 'GoldColectivo'
      },
      {
        field: 'Plus'
      },
      {
        field: 'Care'
      },
      {
        field: 'Nota'
      }];
    this.displayedColumns = this.columns.map(column => column.field);
 
  }


  ngOnInit() {

    //alert(this.jsonData);
    //alert(this.id_param);
    this.getPrestadortarifa();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges() {
    this.getPrestadortarifa();
    console.log(this.jsonData);
  }
  getPrestadortarifa() {
    //this.id_prestador = this.jsonData;
    this.tarifaService.getTarifasbyIDPrestador(this.jsonData)
      .subscribe(prestadortarifas => this.dataSource.data = prestadortarifas);
    return this.prestadortarifas;
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
    this.prestadortarifaUpdate = row;
    if (this.prestadortarifaUpdate.Realizacion == 1) {
      this.prestadortarifaUpdate.Realizacion = 0;
    } else {
      this.prestadortarifaUpdate.Realizacion = 1;
    }
    this.tarifaService.updateTarifaPrestador(this.prestadortarifaUpdate)
      .subscribe(prestadortarifas => this.dataSource.data = prestadortarifas,
        err => {
          console.log(err);
        },
        () => {
           this.ngOnChanges();
        });

      
  }
  getTarifasActivos(){
    this.dataSource.filterPredicate = (data: TarifaServicio, filter: string) => {
      return data.Realizacion.toString().toLocaleLowerCase().includes("1");
    }
  }
  goBack(): void {

  }
  update(): void {

    //  event.preventDefault();

    this.prestadortarifa = this.prestadortarifaForm.value;
    // const id= this.prestadortarifa.IDPrestadortarifa;
    // this.prestadortarifa.IDPrestadortarifa=id;

    // this.prestadorService.updatePrestadortarifa(this.prestadortarifa)
    //  .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.prestadortarifa = this.prestadortarifaForm.value;
    //this.prestadortarifa.IDPrestadortarifa = null;
    /*this.prestadorService.addPrestadortarifa(this.prestadortarifa)
      .subscribe(data => {
        if (data) {

          this.getPrestadortarifa();
          this.prestadortarifaForm.reset();
          this.prestadortarifaForm.controls['Activo'].setValue(true);
        } else {
          window.alert('no se pudo ingresar el elemento');
        }
      });*/

  }
  cancel(): void {


    this.getPrestadortarifa();
    this.prestadortarifaForm.reset();
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
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}




