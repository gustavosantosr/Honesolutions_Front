import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {  CommonModule} from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertsComponent } from '../notifications/alerts.component';

import { BadgesComponent } from '../notifications/badges.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
