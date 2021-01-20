import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoRequerido } from '../../../model/documentoRequerido';
import { DocumentorequeridoService } from '../../../services/documentorequerido.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatCard, MatSortModule, MatSort, MatIcon, MatMenuTrigger, MatMenu } from '@angular/material';
import { QuestionService } from './question.service';
import { Observable, of } from 'rxjs';
import { QuestionBase } from './question-base';
import { HttpClient } from '@angular/common/http';
import { DropdownQuestion } from './question-dropdown';
import { TextboxQuestion } from './question-textbox';

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
  selector: 'app-documentorequeridos',
  templateUrl: './documentorequeridos.component.html',
  styleUrls: ['./documentorequeridos.component.scss'],
  providers: [QuestionService]
})
export class DocumentoRequeridosComponent implements OnInit {
  questions$: Observable<QuestionBase<any>[]>;
  public total = 0;
  public btn_update = false;
  public btn_add = true;
  columns: any[];
  displayedColumns: string[];
  elementos: any[];
  SERVER_URL = 'http://localhost:8080/updatedocumento';
  @Input() documentorequerido: DocumentoRequerido;

  documentorequeridoForm = new FormGroup({
    IDDocumentoRequerido: new FormControl(''),
    DocumentoRequerido: new FormControl('')
  });

  uploadForm: FormGroup;
  _alldata: any[];
  dataSource;
  documentorequeridos: DocumentoRequerido[];
  id_prestador: number;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  groupByColumns: string[] = [];
  barcodeValue;
  filterText = '';

  AfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }




  applyFilter(filterValue: string) {
    this.filterText = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.filterText;
  }

  constructor(private formBuilder: FormBuilder, private documentorequeridoService: DocumentorequeridoService
    , private router: Router, service: QuestionService, private httpClient: HttpClient, private route: ActivatedRoute) {
    this.questions$ = service.getQuestions();
    this.columns = [
      {
        field: 'editar'
      },
      {
        field: 'DocumentoRequerido'
      }];
    this.displayedColumns = this.columns.map(column => column.field);

  }


  ngOnInit() {
    this.id_prestador = +this.route.snapshot.paramMap.get('id');
    this.dataSource = new MatTableDataSource<DocumentoRequerido | Group>(this.getDocumentorequeridos(this.id_prestador))
    this.getDocumentorequeridos(this.id_prestador);
    this.uploadForm = this.formBuilder.group({ file: [''], CampoRequerido: [''] });
  }
  getDocumentorequerido(): void {
    this.documentorequeridoService.getDocumentoRequerido(this.documentorequeridoForm.get('IDDocumentoRequerido').value)
      .subscribe(documentorequerido => this.documentorequerido = documentorequerido);
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }
  }

  getDocumentorequeridos(id: number) {

    this.documentorequeridoService.getDocumentoRequeridosbyPrestador(id)
      .subscribe(documentorequeridos => this.dataSource.data = documentorequeridos);
    return this.documentorequeridos;
  }




  select(id: number): void {
    this.router.navigate(['proveedores/documentorequeridos-detail/' + id]);
  }

  salida(row): void {
    this.router.navigate(['proveedores/salida-detail/' + row.IDDocumentoRequerido]);
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    // alert(row.CampoRequeridoValor);
    this.elementos = JSON.parse(row.CampoRequeridoValor);
    // alert(this.elementos[0]['key']);

    let formControlFields = [];
    for (let k = 0; k < this.elementos.length; k++) {
      formControlFields.push({ name: this.elementos[k].key, control: new FormControl('') });
    }
    formControlFields.forEach(f => this.uploadForm.addControl(f.name, f.control));
    // this.questions$ = of(questions.sort((a, b) => a.order - b.order));
    // obj.forEach(element => this.elementos[0] = new TextboxQuestion(element));

    /*for (let obk of obj) {
      console.log(obk.key);
      const questions: QuestionBase<string>[] = [new TextboxQuestion(obk)];
      this.questions$ = of(questions.sort((a, b) => a.order - b.order));
    }*/

  }

  onSubmit() {
    const formData = new FormData();

    let respuesta = [];
    for (let k = 0; k < this.elementos.length; k++) {
      respuesta.push({
        key: this.elementos[k].key,
        value: this.uploadForm.get(this.elementos[k].key).value,
        type: this.elementos[k].type,
        required: this.elementos[k].required,
        order: this.elementos[k].order
      });
    }
    //alert(this.uploadForm.get('lastname').value);
   alert(JSON.stringify(respuesta));
   //alert("Se realizo el cargue de información");
    this.uploadForm.controls['CampoRequerido'].setValue(JSON.stringify(respuesta));
    //formData.append('file', this.uploadForm.get('profile').value);

    // const formData = new FormData();
    formData.append('media', this.uploadForm.get('file').value);
    var metadata = {
      'IDDocumento': 5012,
      'Nombre': 'documento',
      'FechaRegistro': '2020-03-03',
      'CampoRequeridoValor': JSON.stringify(respuesta),
      'Prestador': {
        'IDPrestador': 861
      },
      'DocumentoTipo': {
        'IDDocumentoTipo': 1
      },
      'Activo': true,
      'Validado': true
    };
    formData.append('metadata', JSON.stringify(metadata));
    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
  setdata(row) {
    const questions: QuestionBase<string>[] = row.DocumentoTipo.CampoRequerido;
    return of(questions);
  }
  goBack(): void {

  }
  update(): void {
    //  event.preventDefault();

    this.documentorequerido = this.documentorequeridoForm.value;
    // const id= this.documentorequerido.IDDocumentoRequerido;
    // this.documentorequerido.IDDocumentoRequerido=id;

    this.documentorequeridoService.updateDocumentoRequerido(this.documentorequerido)
      .subscribe(() => this.cancel());

  }
  save(): void {
    // event.preventDefault();

    this.documentorequerido = this.documentorequeridoForm.value;


    this.documentorequeridoService.addDocumentoRequerido(this.documentorequerido)
      .subscribe(data => {
        if (data) {

          this.getDocumentorequeridos(this.id_prestador);
          this.documentorequeridoForm.reset();
        } else {
          this.documentorequeridoForm.reset();
          window.alert('no se pudo ingresar el elemento');
        }
      });

  }
  cancel(): void {


    this.getDocumentorequeridos(this.id_prestador);
    this.documentorequeridoForm.reset();
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



