import { Component, OnInit } from '@angular/core';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFilesService } from '../../services/upload-files.service';


@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent implements OnInit {

  login = true;
  cargue = false;
  actualizacion = false;

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  fileInfos?: Observable<any>;

  constructor(private uploadService: UploadFilesService) { }
  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }
  selectFiles(event): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    const inputValue = '80819446';

    if (file) {
      this.uploadService.upload(file, inputValue).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        });
    }
  }
  loginUser() {
    const inputValue = (<HTMLInputElement>document.getElementById('identificacion')).value;
    if (inputValue == '80819446') {
      this.login = false;
      this.cargue = false;
      this.actualizacion = true;
    }else{
      alert('El número de identificación no se encuentra registrado en nuestro sistema.');
    }
  }
  cargueDocs() {

    this.login = false;
    this.cargue = true;
    this.actualizacion = false;

  }

}
