import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,  FormControl} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoRequerido } from '../../../model/documentoRequerido';
import { DocumentorequeridoService } from '../../../services/documentorequerido.service';
import { PrestadorService } from '../../../services/prestador.service';


@Component({
  selector: 'app-wizardprestador',
  templateUrl: './wizardprestador.component.html',
  styleUrls: ['./wizardprestador.component.scss']
})
export class WizardprestadorComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup[];
  secondFormGroup: FormGroup;
  uploadForm: FormGroup;
  documentorequeridos: DocumentoRequerido[];
  id_prestador: number;

  constructor(private _formBuilder: FormBuilder, private documentorequeridoService: DocumentorequeridoService
    , private router: Router,  private httpClient: HttpClient, private route: ActivatedRoute,
    private sanitizer: DomSanitizer, private prestadorService: PrestadorService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.id_prestador = 1;
    this.getDocumentorequeridos(this.id_prestador);
    this.firstFormGroup[0] = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  getDocumentorequeridos(id: number) {

    this.documentorequeridoService.getDocumentoRequeridosbyPrestador(id)
      .subscribe(documentorequeridos => this.documentorequeridos = documentorequeridos);
    return this.documentorequeridos;
  }
  crearCampos(elementos: any){
    alert(JSON.parse(elementos));
    elementos = JSON.parse(elementos);
    // alert(this.elementos[0]['key']);

    let formControlFields = [];
    for (let k = 0; k < elementos.length; k++) {
      formControlFields.push({ name: elementos[k].key, control: new FormControl('') });
    }
    formControlFields.forEach(f => this.uploadForm.addControl(f.name, f.control));
    return JSON.parse(elementos);
  }
}