import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatMenuTrigger, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Prestador } from '../../../model/prestador';
import { AuthService } from '../../../services/auth.service';
import { PrestadorService } from '../../../services/prestador.service';


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
  selector: 'app-prestadoresgestor',
  templateUrl: './prestadoresgestor.component.html',
  styleUrls: ['./prestadoresgestor.component.scss']
})


export class PrestadoresgestorComponent implements OnInit {
  [x: string]: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  dataSource = new MatTableDataSource<Prestador | Group>(this.getPrestadores());
  prestadores: Prestador[];
  @Input() prestador: Prestador;
  displayedColumns: string[];
  tipoUsuario: number;
  columns: any[];
  constructor(private prestadorService: PrestadorService,
    private router: Router,
    private Auth: AuthService) {

    this.columns = [
      {
        field: 'IDPrestador'
      },
      {
        field: 'IdentificacionTipo'
      },
      {
        field: 'Identificacion'
      },
      {
        field: 'Nombre'
      },
      {
        field: 'Email'
      },
      {
        field: 'TelefonoContacto'
      },
      {
        field: 'TotalDocs'
      },
      {
        field: 'PendienteDocs'
      },
      {
        field: 'Completado'
      },
      {
        field: 'docs'
      }

    ];
    this.displayedColumns = this.columns.map(column => column.field);
  }
  completePrestador(row, state) {
    this.prestador = row;
    //alert(state);
    if (this.prestador.Completado == true) {
      this.prestador.Completado = false;
    } else {
      this.prestador.Completado = true;
    }
    this.prestadorService.CompletePrestador(this.prestador)
      .subscribe(prestador => this.prestador = prestador,
        err => {
          alert("No se pudo realizar el ajuste");
        },
        () => {


         /* if (this.prestador.status == 'OK') {
            alert(this.prestador.msg);

          } else {
            alert(this.prestador.msg);
          }*/

        });
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  ngOnInit() {
    this.tipoUsuario = this.Auth.getId;
    this.getPrestadores();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  AfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);

    this.prestador = row;
  }

  getPrestadores() {
    // debugger
    this.prestadorService.getPrestadoresGestor(this.tipoUsuario)
      .subscribe(prestadoresTemp => this.dataSource.data = prestadoresTemp);

    return this.prestadores;
  }

  docRequeridos(row): void {
    this.router.navigate(['honesolutions/documentorequeridos/' + row.IDPrestador + '/' + row.Nombre]);
  }

}
