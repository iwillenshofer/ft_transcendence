import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [
	AlertsComponent
  ],
  
  imports: [
    CommonModule,
	AlertModule,
  ],
  exports: [
	AlertsComponent
  ]
})

export class AlertsModule { }
