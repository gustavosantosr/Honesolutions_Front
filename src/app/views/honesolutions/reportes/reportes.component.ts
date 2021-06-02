import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentoReporte } from '../../../model/documentoRequerido';
import { Prestador, PrestadorReport } from '../../../model/prestador';
import { Tarifa, TarifaReport } from '../../../model/tarifa';
import { DocumentorequeridoService } from '../../../services/documentorequerido.service';
import { PrestadorService } from '../../../services/prestador.service';
import { TarifaService } from '../../../services/tarifa.service';
import { WebDataRocksPivot } from '../../webdatarocks/webdatarocks.angular4';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild('pivot', { static: false }) child: WebDataRocksPivot;
  prestadores: PrestadorReport[];
  tarifas: TarifaReport[];
  documentos: DocumentoReporte[];
  constructor(private prestadorService: PrestadorService, private tarifaService: TarifaService,
    private documentoRequeridosService: DocumentorequeridoService,
    private router: Router) { }

  ngOnInit() {
    this.getDocumentos();
  }
  getPrestadores() {

    this.prestadorService.getPrestadoresReport()
      .subscribe(prestadores => this.prestadores = prestadores,
        err => {
          console.log(err);
        },
        () => {
          //this.spinner.hide();
          this.onReportComplete();
        });
  }
  getDocumentos() {

    this.documentoRequeridosService.getDocumentoRequeridosReporte()
      .subscribe(documentos => this.documentos = documentos,
        err => {
          console.log(err);
        },
        () => {
          //this.spinner.hide();
          this.onReportDocumentosComplete();
        });
  }
  getTarifas() {

    this.tarifaService.getTarifasReporte()
      .subscribe(tarifas => this.tarifas = tarifas,
        err => {
          console.log(err);
        },
        () => {
          //this.spinner.hide();
          this.onReportTarifasComplete();
        });
  }
  onPivotReady(pivot: WebDataRocks.Pivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }


  onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
    //console.log("[customizeCell] WebDataRocksPivot");

    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");


    if (data.isDrillThrough) {
      if (
        data.type == "value" &&
        data.hierarchy &&
        data.hierarchy.uniqueName == "URL"
      ) {
        cell.text = `<a class="btn" <a href='#/$URL' >Ir al prestador</a>`.replace('$URL', data.label);
        //cell.text = `<a class="btn" [routerLink]="['/$URL']" href="$URL" traget="_blank" (click)="clickCell();">Open Invoice</a>`.replace('$URL', data.label);
      }
    }

    //cell.text = `<a href="${data.label}">data-cell='${JSON.stringify(data)}'</a>`;
    //cell.addClass("editable")
    /*if (data && data.type != "") {
      
      cell.text = `<input type="text" value="${data.label}" (onchange)="clickCell()" data-cell='${JSON.stringify(data)}'>`;
      cell.addClass("editable")
     
    }*/
  }

  onChange(event) {
    alert(event.target.value.replace(/\s/g, ''));

  }

  onReportComplete(): void {
    //this.child.webDataRocks.connectTo(Object.assign(this.terminados));
    //Object.assign(this.x,  this.terminados[0].conos);
    //alert("xxx");
    // this.child.webDataRocks.load('https://daltex.drmonkey.co/data/GruposQ.php?comando=query1');

    this.child.webDataRocks.off("reportcomplete");
    this.child.webDataRocks.setReport({
      dataSource: {
        data: Object.assign(this.prestadores)
      },
      "slice": {
      },
      "options": {
        "grid": {
          "type": "flat"
        },
        "editing": true
      }
    });

  }
  onReportDocumentosComplete(): void {
    //this.child.webDataRocks.connectTo(Object.assign(this.terminados));
    //Object.assign(this.x,  this.terminados[0].conos);
    //alert("xxx");
    // this.child.webDataRocks.load('https://daltex.drmonkey.co/data/GruposQ.php?comando=query1');

    this.child.webDataRocks.off("reportcomplete");
    this.child.webDataRocks.setReport({
      dataSource: {
        data: Object.assign(this.documentos)
      },
      "slice": {
        "rows": [
            {
                "uniqueName": "DocumentoTipo"
            }
        ],
        "columns": [
            {
                "uniqueName": "Validado"
            },
            {
                "uniqueName": "Measures"
            }
        ],
        "measures": [
            {
                "uniqueName": "Identificacion",
                "aggregation": "count"
            }
        ]
    }

    });

  }
  clickCell(): void {
    alert("aaaa");

  }

  onReportTarifasComplete(): void {
    this.child.webDataRocks.on('datachanged', function (e) {
      alert("Data changed\n field: "
        + e.data[0].field
        + ", row id: "
        + e.data[0].id
        + ", new value: "
        + e.data[0].value
        + ", previous value: "
        + e.data[0].oldValue);
    });

    this.child.webDataRocks.off("reportcomplete");
    this.child.webDataRocks.setReport({
      dataSource: {
        data: Object.assign(this.tarifas)
      },
      "slice": {
        "rows": [
          {
            "uniqueName": "Descripcion3495"
          },
          {
            "uniqueName": "Resolucion3495"
          }
        ],
        "columns": [
          {
            "uniqueName": "Vigencia",
            "sort": "unsorted"
          },
          {
            "uniqueName": "UVR",
            "sort": "unsorted"
          },
          {
            "uniqueName": "Care",
            "sort": "unsorted"
          },
          {
            "uniqueName": "Measures"
          },
          {
            "uniqueName": "GoldColectivo",
            "sort": "unsorted"
          },
          {
            "uniqueName": "Plus",
            "sort": "unsorted"
          }
        ],
        "measures": [
          {
            "uniqueName": "IDTarifa",
            "aggregation": "sum"
          },
          {
            "uniqueName": "Resolucion3495",
            "aggregation": "sum",
            "active": false,
            "format": "4fmjlusj"
          },
          {
            "uniqueName": "Vigencia",
            "aggregation": "sum",
            "active": false,
            "format": "4fmjn4pw"
          }
        ],
        "flatOrder": [
          "Vigencia",
          "Resolucion3495",
          "Descripcion3495",
          "UVR",
          "Care",
          "GoldColectivo",
          "Plus",
          "IDTarifa"
        ]
      },
      "options": {
        "grid": {
          "type": "flat",
          "showTotals": "off",
          "showGrandTotals": "off"
        },
        "editing": true
      }
    });




  }
}
