import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Vehiculo } from '../../../model/vehiculo';
import { VehiculoService } from '../../../services/vehiculo.service';
import { Propietario } from '../../../model/propietario';
import { PropietarioService } from '../../../services/propietario.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { VehiculoTipo } from '../../../model/vehiculoTipo';
import { VehiculotipoService } from '../../../services/vehiculotipo.service';
import { VehiculoMarca } from '../../../model/vehiculoMarca';
import { VehiculomarcaService } from '../../../services/vehiculomarca.service';
import { VehiculoReferencia } from '../../../model/vehiculoReferencia';
import { VehiculoreferenciaService } from '../../../services/vehiculoreferencia.service';
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
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];

  @Input() vehiculo: Vehiculo;

  vehiculoForm = new FormGroup({
    IDVehiculo: new FormControl(''),
    IDPropietario: new FormControl(''),
    IDVehiculoMarca: new FormControl(''),
    IDVehiculoReferencia: new FormControl(''),
    IDVehiculoTipo: new FormControl(''),
    Placa: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<Vehiculo | Group>(this.getVehiculos());
  vehiculos: Vehiculo[];
  vehiculotipos: VehiculoTipo[];
  vehiculomarcas: VehiculoMarca[];
  vehiculoreferencias: VehiculoReferencia[];
  propietarios: Propietario[];

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

  constructor(private vehiculoService: VehiculoService
    , private router: Router
    , private vehiculotipoService: VehiculotipoService
    , private propietarioService: PropietarioService
    , private vehiculomarcaService: VehiculomarcaService
    , private vehiculoreferenciaService: VehiculoreferenciaService
    ) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'Placa'
      },
      {
        field: 'Marca'
      },
      {
        field: 'Referencia'
      },
      {
        field: 'Tipo'
      },
      {
        field: 'IDVehiculo'
      },
      {
        field: 'Nombres'
      },
      {
        field: 'Apellidos'
      },
      {
        field: 'Placa'
      }];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.getVehiculos();
    this.getVehiculotipos();
    this.getPropietarios();
    this.getVehiculomarcas();
    this.getVehiculoreferencias();
  }
  getVehiculo(): void {
    this.vehiculoService.getVehiculo(this.vehiculoForm.get('IDVehiculo').value)
      .subscribe(vehiculo => this.vehiculo = vehiculo);
  }


  getVehiculos() {

    this.vehiculoService.getVehiculos()
      .subscribe(vehiculos => this.dataSource.data = vehiculos);



    return this.vehiculos;
  }

  getVehiculotipos() {
    this.vehiculotipoService.getVehiculoTipos()
      .subscribe(vehiculotipos => this.vehiculotipos = vehiculotipos);
    return this.vehiculotipos;
  }
  getVehiculomarcas() {
    this.vehiculomarcaService.getVehiculoMarcas()
      .subscribe(vehiculomarcas => this.vehiculomarcas = vehiculomarcas);
    return this.vehiculomarcas;
  }
  getVehiculoreferencias() {
    this.vehiculoreferenciaService.getVehiculoReferencias()
      .subscribe(vehiculoreferencias => this.vehiculoreferencias = vehiculoreferencias);
    return this.vehiculoreferencias;
  }
  getPropietarios() {
    this.propietarioService.getPropietarios()
      .subscribe(propietarios => this.propietarios = propietarios);
    return this.propietarios;
  }


  select(id: number): void {
    this.router.navigate(['proveedores/vehiculos-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDVehiculo]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    this.vehiculo = row;
    this.vehiculoForm.controls['IDPropietario'].setValue(this.vehiculo.Propietario.IDPropietario);
    //this.vehiculoForm.setValue(row);
    this.btn_add = false;
    this.btn_update = true;
  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.vehiculo = this.vehiculoForm.value;
    // const id= this.vehiculo.IDVehiculo;
    // this.vehiculo.IDVehiculo=id;

    this.vehiculoService.updateVehiculo(this.vehiculo)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.vehiculo = this.vehiculoForm.value;
    this.vehiculo.IDVehiculo = null;

    this.vehiculoService.addVehiculo(this.vehiculo)
      .subscribe(data => {
        if (data) {

          this.getVehiculos();
          this.vehiculoForm.reset();
        } else {
          this.vehiculoForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      });

  }
  cancel(): void {


    this.getVehiculos();
    this.vehiculoForm.reset();
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

