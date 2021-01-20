import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Conductor } from '../../../model/conductor';
import { ConductorService } from '../../../services/conductor.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { DocumentoTipo } from '../../../model/documentoTipo';
import { DocumentotipoService } from '../../../services/documentotipo.service';
import { SangreTipo } from '../../../model/sangreTipo';
import { SangretipoService } from '../../../services/sangretipo.service';

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
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class ConductoresComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];

  @Input() conductor: Conductor;

  conductorForm = new FormGroup({
    IDConductor: new FormControl(''),
    IDDocumentoTipo: new FormControl(''),
    Documento: new FormControl(''),
    Nombres: new FormControl(''),
    Apellidos: new FormControl(''),
    Email: new FormControl(''),
    Celular: new FormControl(''),
    FechaNacimiento: new FormControl(''),
    IDSangreTipo: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<Conductor | Group>(this.getConductores());
  conductores: Conductor[];
  documentotipos: DocumentoTipo[];
  sangretipos: SangreTipo[];


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

  constructor(private conductorService: ConductorService,
    private router: Router,
    private documentotipoService: DocumentotipoService,
    private sangretipoService: SangretipoService) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'foto'
      },
      {
        field: 'IDConductor'
      },
      {
        field: 'DocumentoTipo'
      },
      {
        field: 'Documento'
      },
      {
        field: 'Nombres'
      },
      {
        field: 'Apellidos'
      },
      {
        field: 'Email'
      },
      {
        field: 'Celular'
      },
      {
        field: 'FechaNacimiento'
      },
      {
        field: 'FechaRegistro'
      }
      ,
      {
        field: 'info'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.getConductores();
    this.getDocumentotipos();
    this.getSangretipos();
  }
  getConductor(): void {
    this.conductorService.getConductor(this.conductorForm.get('IDConductor').value)
      .subscribe(conductor => this.conductor = conductor);
  }
  getDocumentotipos() {
    this.documentotipoService.getDocumentoTipos()
      .subscribe(documentotipos => this.documentotipos = documentotipos);
    return this.documentotipos;
  }
  getSangretipos() {
    this.sangretipoService.getSangreTipos()
      .subscribe(sangretipos => this.sangretipos = sangretipos);
    return this.sangretipos;
  }

  getConductores() {

    this.conductorService.getConductores()
      .subscribe(conductores => this.dataSource.data = conductores);



    return this.conductores;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/conductores-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDConductor]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.conductor = row;
    this.conductorForm.controls['IDConductor'].setValue(this.conductor.IDConductor);
    this.conductorForm.controls['IDDocumentoTipo'].setValue(this.conductor.DocumentoTipo.IDDocumentoTipo);
    this.conductorForm.controls['Documento'].setValue(this.conductor.Documento);
    this.conductorForm.controls['Nombres'].setValue(this.conductor.Nombres);
    this.conductorForm.controls['Apellidos'].setValue(this.conductor.Apellidos);
    this.conductorForm.controls['Email'].setValue(this.conductor.Email);
    this.conductorForm.controls['Celular'].setValue(this.conductor.Celular);
    this.conductorForm.controls['FechaNacimiento'].setValue(this.conductor.FechaNacimiento);
    this.conductorForm.controls['IDSangreTipo'].setValue(this.conductor.SangreTipo.IDSangreTipo);
    this.btn_add = false;
    this.btn_update = true;
  }
  info(row) {
    console.log('Row clicked: ', row);
    
    this.conductor = row;
    this.router.navigate(['/honesolutions/conductor-detail/' + this.conductor.IDConductor]);

  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.conductor = this.conductorForm.value;
    // const id= this.conductor.IDConductor;
    // this.conductor.IDConductor=id;

    this.conductorService.updateConductor(this.conductor)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.conductor = this.conductorForm.value;
    this.conductor.IDConductor = null;

    this.conductorService.addConductor(this.conductor)
      .subscribe(data => {
        if (data) {

          this.getConductores();
          this.conductorForm.reset();
        } else {
          // this.conductorForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getConductores();
    this.conductorForm.reset();
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
