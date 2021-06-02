import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarifasprestador',
  templateUrl: './tarifasprestador.component.html',
  styleUrls: ['./tarifasprestador.component.scss']
})
export class TarifasprestadorComponent implements OnInit {
  data = 2;
  constructor() { }

  ngOnInit() {
    this.data=2;
  }

}
