import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Representante } from '../../../model/representante';
import { RepresentanteService } from '../../../services/representante.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { DocumentoTipo } from '../../../model/documentoTipo';
import { DocumentotipoService } from '../../../services/documentotipo.service';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';

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
  selector: 'app-representantes',
  templateUrl: './representantes.component.html',
  styleUrls: ['./representantes.component.scss']
})
export class RepresentantesComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];

  @Input() representante: Representante;

  representanteForm = new FormGroup({
    IDRepresentante: new FormControl(''),
    IDDocumentoTipo: new FormControl(''),
    Documento: new FormControl(''),
    Nombres: new FormControl(''),
    Apellidos: new FormControl(''),
    Email: new FormControl(''),
    Area: new FormControl(''),
    Celular: new FormControl(''),
    IDCliente: new FormControl('')
  });


  _alldata: any[];
  dataSource = new MatTableDataSource<Representante | Group>(this.getRepresentantes());
  representantes: Representante[];
  documentotipos: DocumentoTipo[];
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

  constructor(private representanteService: RepresentanteService,
    private router: Router,
    private documentotipoService: DocumentotipoService,
    private clienteService: ClienteService, 
    private route: ActivatedRoute) {

    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDRepresentante'
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
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    const id_cliente = +this.route.snapshot.paramMap.get('id');
    if (id_cliente==0 ){
      this.getRepresentantes();
    } else {
      this.getRepresentantesbyIDCliente();
    }
    this.getDocumentotipos();
    this.getClientes();
  }
  getRepresentante(): void {
    this.representanteService.getRepresentante(this.representanteForm.get('IDRepresentante').value)
      .subscribe(representante => this.representante = representante);
  }
  getDocumentotipos() {
    this.documentotipoService.getDocumentoTipos()
      .subscribe(documentotipos => this.documentotipos = documentotipos);
    return this.documentotipos;
  }
  getClientes() {
    this.clienteService.getClientes()
      .subscribe(clientes => this.clientes = clientes);
    return this.clientes;
  }

  getRepresentantes() {

    this.representanteService.getRepresentantes()
      .subscribe(representantes => this.dataSource.data = representantes);



    return this.representantes;
  }
  getRepresentantesbyIDCliente() {

    this.representanteService.getRepresentantebyId(2)
      .subscribe(representantes => this.dataSource.data = representantes);



    return this.representantes;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/representantes-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDRepresentante]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.representante = row;
    this.representanteForm.controls['IDRepresentante'].setValue(this.representante.IDRepresentante);
    this.representanteForm.controls['IDDocumentoTipo'].setValue(this.representante.DocumentoTipo.IDDocumentoTipo);
    this.representanteForm.controls['Documento'].setValue(this.representante.Documento);
    this.representanteForm.controls['Nombres'].setValue(this.representante.Nombres);
    this.representanteForm.controls['Apellidos'].setValue(this.representante.Apellidos);
    this.representanteForm.controls['Email'].setValue(this.representante.Email);
    this.representanteForm.controls['Celular'].setValue(this.representante.Celular);
    this.btn_add = false;
    this.btn_update = true;
  }
  info(row) {
    console.log('Row clicked: ', row);
    
    this.representante = row;
    this.router.navigate(['/honesolutions/representante-detail/' + this.representante.IDRepresentante]);

  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.representante = this.representanteForm.value;
    // const id= this.representante.IDRepresentante;
    // this.representante.IDRepresentante=id;

    this.representanteService.updateRepresentante(this.representante)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.representante = this.representanteForm.value;
    this.representante.IDRepresentante = null;

    this.representanteService.addRepresentante(this.representante)
      .subscribe(data => {
        if (data) {

          this.getRepresentantes();
          this.representanteForm.reset();
        } else {
          // this.representanteForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getRepresentantes();
    this.representanteForm.reset();
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
