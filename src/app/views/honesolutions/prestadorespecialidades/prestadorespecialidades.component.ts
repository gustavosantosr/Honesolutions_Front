import { AfterViewInit, Component, OnInit, Output, Input, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ciudad } from '../../../model/ciudad';
import { CiudadService } from '../../../services/ciudad.service';
import { Especialidad } from '../../../model/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { Validators } from '@angular/forms';
import { PrestadorEspecialidad } from '../../../model/prestador';
import { PrestadorService } from '../../../services/prestador.service';
import { TarifaServicio } from '../../../model/tarifa';
import { TarifaService } from '../../../services/tarifa.service';

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
  selector: 'app-prestadorespecialidades',
  templateUrl: './prestadorespecialidades.component.html',
  styleUrls: ['./prestadorespecialidades.component.scss']
})
export class PrestadorespecialidadesComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];
  @Input()
  jsonData: number;
  prestadorespecialidades: PrestadorEspecialidad[];
  @Input() prestadorespecialidad: PrestadorEspecialidad;

  prestadorespecialidadForm = new FormGroup({
    IDEspecialidad: new FormControl(''),
    IDPrestador: new FormControl('')
  });

  get Prestadorespecialidad() {
    return this.prestadorespecialidadForm.get('Prestadorespecialidad');
  }

  get Codigo() {
    return this.prestadorespecialidadForm.get('Codigo');
  }


  _alldata: any[];
  dataSource = new MatTableDataSource<PrestadorEspecialidad | Group>(this.getPrestadorespecialidad());
  especialidades: Especialidad[];
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
    this.filterText = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterText;
  }

  constructor(private prestadorService: PrestadorService, private especialidadService: EspecialidadService
    , private router: Router, private route: ActivatedRoute) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDPrestadorEspecialidad'
      },
      {
        field: 'IDPrestador'
      },
      {
        field: 'IDEspecialidad'
      },
      {
        field: 'Especialidad'
      }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.dataSource.filterPredicate = (data: PrestadorEspecialidad, filter: string) => {
      return data.IDPrestador.toString().toLocaleLowerCase().includes(filter) ||
        data.IDEspecialidad.toString().toLocaleLowerCase().includes(filter);
    }
  }


  ngOnInit() {

   //alert(this.jsonData);
    //alert(this.id_param);
    this.getPrestadorespecialidad();
    this.getEspecialidadesActivos();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges() {
    this.getPrestadorespecialidad();
     console.log(this.jsonData);
    }  
  getPrestadorespecialidad() {
    //this.id_prestador = this.jsonData;
    this.prestadorService.getEspecialidadbyIDPrestador(this.jsonData)
      .subscribe(prestadorespecialidades => this.dataSource.data = prestadorespecialidades);
    return this.prestadorespecialidades;
  }


  getEspecialidadesActivos() {
    this.especialidadService.getEspecialidadesActivo()
      .subscribe(especialidades => this.especialidades = especialidades);
    return this.especialidades;
  }


  select(id: number): void {
    this.router.navigate(['proveedores/prestadorespecialidades-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDPrestadorespecialidad]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.prestadorespecialidadForm.setValue(row);
    this.btn_add = false;
    this.btn_update = true;
  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.prestadorespecialidad = this.prestadorespecialidadForm.value;
    // const id= this.prestadorespecialidad.IDPrestadorespecialidad;
    // this.prestadorespecialidad.IDPrestadorespecialidad=id;

    // this.prestadorService.updatePrestadorespecialidad(this.prestadorespecialidad)
    //  .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.prestadorespecialidad = this.prestadorespecialidadForm.value;
    //this.prestadorespecialidad.IDPrestadorespecialidad = null;
    /*this.prestadorService.addPrestadorespecialidad(this.prestadorespecialidad)
      .subscribe(data => {
        if (data) {

          this.getPrestadorespecialidad();
          this.prestadorespecialidadForm.reset();
          this.prestadorespecialidadForm.controls['Activo'].setValue(true);
        } else {
          window.alert('no se pudo ingresar el elemento');
        }
      });*/

  }
  cancel(): void {


    this.getPrestadorespecialidad();
    this.prestadorespecialidadForm.reset();
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




