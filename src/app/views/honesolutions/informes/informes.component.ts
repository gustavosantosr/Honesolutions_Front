import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { WebDataRocksPivot } from '../../webdatarocks/webdatarocks.angular4';
import { Pieza } from '../../../model/pieza';
import { PiezaService } from '../../../services/pieza.service';
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {
  @ViewChild('pivot', { static: false }) child: WebDataRocksPivot;
  piezas: Pieza[];
  constructor(private piezaService: PiezaService) { }

  ngOnInit() {
    this.getPiezas();
  }
  getPiezas() {

    this.piezaService.getPiezas()
      .subscribe(piezas => this.piezas = piezas,
        err => {
          console.log(err);
        },
        () => {
          //this.spinner.hide();
          this.onReportComplete();
        });
  }
  onPivotLeery(pivot: WebDataRocks.Pivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }

  onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
    //console.log("[customizeCell] WebDataRocksPivot");
    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
  }

  onReportComplete(): void {
    //this.child.webDataRocks.connectTo(Object.assign(this.terminados));
    //Object.assign(this.x,  this.terminados[0].conos);
    //alert("xxx");
    // this.child.webDataRocks.load('https://daltex.drmonkey.co/data/GruposQ.php?comando=query1');
 
    this.child.webDataRocks.off("reportcomplete");
    this.child.webDataRocks.setReport({
      dataSource: {
        data: Object.assign(this.piezas)
      },
      "slice": {
      },
      "options": {
        "grid": {
          "type": "classic"
        }
      }
    });

  }
}
