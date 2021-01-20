import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConductorService } from '../../../services/conductor.service';
import { Conductor } from '../../../model/conductor';
import { Lightbox } from 'ngx-lightbox';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-conductor-detail',
  templateUrl: './conductor-detail.component.html',
  styleUrls: ['./conductor-detail.component.scss']
})
export class ConductorDetailComponent implements OnInit {
  SERVER_URL = 'http://localhost:8080/uploadcedula';
  @Input() conductor: Conductor;
  uploadForm = new FormGroup({
    FechaVenCedula: new FormControl(''),
    FechaExpCedula: new FormControl(''),
    uploadfile: new FormControl(''),
    IDConductor: new FormControl('')
  });
  private _album = [];
  btn_update = false;
  constructor(private conductorService: ConductorService
    , private route: ActivatedRoute,
    private _lightbox: Lightbox,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) { }
  AfterViewInit() {
    this.getConductor();

  }
  ngOnInit() {
    this.getConductor();
  }
  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('uploadfile').setValue(file);
    }
  }
  onSubmit() {
   const formData = new FormData();
    formData.append('uploadfile', this.uploadForm.get('uploadfile').value);
    formData.append('IDConductor', this.uploadForm.controls['IDConductor'].value);
    formData.append('FechaVenCedula', this.uploadForm.controls['FechaVenCedula'].value);
    formData.append('FechaExpCedula', this.uploadForm.controls['FechaExpCedula'].value);
    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }
  getConductor() {
    const id_conductor = +this.route.snapshot.paramMap.get('id');
    this.conductorService.getConductor(id_conductor)
      .subscribe(conductor => this.conductor = conductor);

    this.conductorService.getConductor(id_conductor)
      .subscribe(conductor => this.conductor = conductor,
        err => {
          alert(err);
        },
        () => {
          //alert(this.conductor.Apellidos);
          this.uploadForm.controls['IDConductor'].setValue(this.conductor.IDConductor);

        });
  }
  open(index: number): void {
    for (let i = 1; i <= 4; i++) {
      const src = 'https://honesolutions.drmonkey.co/documentos/cedula.png';
      const caption = 'Image ' + i + ' caption here';
      const thumb = 'demo/img/image' + i + '-thumb.jpg';
      const album = {
        src: src,
        caption: caption,
        thumb: thumb
      };

      this._album.push(album);
    }
    // open lightbox
    this._lightbox.open(this._album, index);
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }
  Actualizar(): void {
    // close lightbox programmatically
    this.btn_update = true;
  }

}
