import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Salida } from '../../../model/salida';
import { SalidaService } from '../../../services/salida.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { DocumentoTipo } from '../../../model/documentoTipo';
import { DocumentotipoService } from '../../../services/documentotipo.service';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../../services/cliente.service';
import { Despacho } from '../../../model/despacho';
import { DespachoService } from '../../../services/despacho.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Pieza } from '../../../model/pieza';
import { PiezaService } from '../../../services/pieza.service';

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
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent implements OnInit {

  public total = 0;
  public btn_update = false;
  public btn_add = true;
  url: string;
  columns: any[];
  displayedColumns: string[];
  displayedDespachoColumns: string[];
  displayedPiezasColumns: string[];
  @Input() salida: Salida;
  @Input() despacho: Despacho;
  @Input() pieza: Pieza;
  filterText = '';
  salidaForm = new FormGroup({
    IDSalida: new FormControl(''),
    IDDespacho: new FormControl(''),
    IDPieza: new FormControl(''),
    MetrosDespachados: new FormControl('')
  });


  _alldata: any[];
  dataDespachosSource = new MatTableDataSource<Despacho>(this.getDespachos());
  despachos: Despacho[];

  dataPiezasSource = new MatTableDataSource<Pieza | Group>(this.getPiezas());
  piezas: Pieza[];

  dataSource = new MatTableDataSource<Salida>(this.getSalidas());
  salidas: Salida[];
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
  applyFilterPieza(filterValue: string) {
    this.filterText = filterValue.trim().toLowerCase();
    this.dataPiezasSource.filter = this.filterText;
  }
  applyDespachoFilter(filterValue: string) {
    this.filterText = filterValue.trim().toLowerCase();
    this.dataDespachosSource.filter = this.filterText;
  }

  constructor(private piezaService: PiezaService, private despachoService: DespachoService, private salidaService: SalidaService,
    private router: Router,
    private documentotipoService: DocumentotipoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute) {
      
    this.dataSource.filterPredicate = (data: Salida, filter: string) => {
      return  data.Pieza.MetrosRecibidos.toString().toLocaleLowerCase().includes(filter) ||
        data.MetrosDespachados.toString().toLocaleLowerCase().includes(filter) ||
        data.Pieza.Lote.toString().toLocaleLowerCase().includes(filter);
    }
    this.dataDespachosSource.filterPredicate = (data: Despacho, filter: string) => {
      return data.DespachoEstado.DespachoEstado.toString().toLocaleLowerCase().includes(filter) ||
        data.FechaDespacho.toString().toLocaleLowerCase().includes(filter) ||
        data.IDDespacho.toString().toLocaleLowerCase().includes(filter);
    }

    this.dataPiezasSource.filterPredicate = (data: Pieza, filter: string) => {
      return data.Numero.toString().toLocaleLowerCase().includes(filter) ||
        data.Codigo.toString().toLocaleLowerCase().includes(filter) ||
        data.Descripcion.toString().toLocaleLowerCase().includes(filter) ||
        data.Descripcion.toString().toLocaleLowerCase().includes(filter) ||
        data.MetrosRecibidos.toString().toLocaleLowerCase().includes(filter) ||
        data.FechaRegistro.toString().toLocaleLowerCase().includes(filter) ||
        data.Observaciones.toString().toLocaleLowerCase().includes(filter) ||
        data.Lote.toString().toLocaleLowerCase().includes(filter);
    }
    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'IDSalida'
      },
      {
        field: 'IDDespacho'
      },
      {
        field: 'Codigo'
      },
      {
        field: 'Cliente'
      },
      {
        field: 'MetrosRecibidos'
      },
      {
        field: 'MetrosDespachados'
      },
      {
        field: 'Lote'
      },
      {
        field: 'Numero'
      },
      {
        field: 'ServicioTipo'
      },
      {
        field: 'Email'
      },
      {
        field: 'Observaciones'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);
    this.columns = [
      {
        field: 'Agregar'
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
      }

    ];
    this.displayedDespachoColumns = this.columns.map(column => column.field);
    this.columns = [
      {
        field: 'Agregar'
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
    this.displayedPiezasColumns = this.columns.map(column => column.field);
  }


  ngOnInit() {
    const id_cliente = +this.route.snapshot.paramMap.get('id');
    if (id_cliente == 0) {
      this.getSalidas();
    } else {
      this.salidaForm.controls['IDDespacho'].setValue(id_cliente);
    }
    // this.getDocumentotipos();
    this.getClientes();
  
  }
  getPiezas() {
    this.piezaService.getPiezas()
      .subscribe(piezas => this.dataPiezasSource.data = piezas);
    return this.piezas;
  }
  getPiezasbyCliente(IDCliente: number) {
    this.piezaService.getPiezasbyCliente(IDCliente)
      .subscribe(piezas => this.dataPiezasSource.data = piezas);
    return this.piezas;
  }
  getDespachos() {

    this.despachoService.getDespachoActivos()
      .subscribe(despachos => this.dataDespachosSource.data = despachos);



    return this.despachos;
  }
  getSalida(): void {
    this.salidaService.getSalida(this.salidaForm.get('IDSalida').value)
      .subscribe(salida => this.salida = salida);
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

  getSalidas() {

    this.salidaService.getSalidas()
      .subscribe(salidas => this.dataSource.data = salidas);



    return this.salidas;
  }





  select(id: number): void {
    this.router.navigate(['proveedores/salidas-detail/' + id]);
  }
  agregarDespacho(row) {
    console.log('Row clicked: ', row);

    this.despacho = row;
    this.salidaForm.controls['IDDespacho'].setValue(this.despacho.IDDespacho);
    this.getPiezasbyCliente(this.despacho.Cliente.IDCliente);
  }
  agregarPieza(row) {
    console.log('Row clicked: ', row);

    this.pieza = row;
    this.salidaForm.controls['IDPieza'].setValue(this.pieza.IDPieza);
    this.salidaForm.controls['MetrosDespachados'].setValue(this.pieza.MetrosRecibidos);
    this.filterText = '';
  }


  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.salida = row;
    this.salidaForm.controls['IDSalida'].setValue(this.salida.IDSalida);
    this.btn_add = false;
    this.btn_update = true;
  }
  info(row) {
    console.log('Row clicked: ', row);

    this.salida = row;
    this.router.navigate(['/honesolutions/salida-detail/' + this.salida.IDSalida]);

  }
  onRowClicked1(row) {

    this.url = 'https://drmonkey.co/daltex/imprimir_honesolutions.php?codigo=' + row.Pieza.Codigo + '&cliente=' + row.Despacho.Cliente.RazonSocial + '&numero=' + row.Pieza.Numero + '&servicio=' + row.Pieza.ServicioTipo.ServicioTipo + '&observaciones=' + row.Pieza.Observaciones + '&metros=' + row.Pieza.MetrosRecibidos + '&lote=' + row.Pieza.Lote + '&valor=1';
    window.open(this.url, 'popup', 'width=800,height=400,');

  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.salida = this.salidaForm.value;
    // const id= this.salida.IDSalida;
    // this.salida.IDSalida=id;

    this.salidaService.updateSalida(this.salida)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.salida = this.salidaForm.value;
    this.salida.IDSalida = null;

    this.salidaService.addSalida(this.salida)
      .subscribe(data => {
        if (data) {

          this.getSalidas();
          this.getPiezas();
          this.salidaForm.reset();
        } else {
          // this.salidaForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      }, err => {
        alert(err);
      });

  }
  cancel(): void {


    this.getSalidas();
    this.salidaForm.reset();
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

