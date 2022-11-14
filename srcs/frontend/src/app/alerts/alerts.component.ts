import { Component, Input, OnInit } from '@angular/core';
import { AlertModel } from './alerts.model';
import { AlertsService } from './alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

export class AlertsComponent implements OnInit {

  constructor(
    private alertsService: AlertsService
  ) { }
  alerts: AlertModel[] = [];

  ngOnInit(): void {
    this.acceptable = this.alertsService.acceptable;
    this.alertsService.getAlerts().subscribe(messages => {
      this.alerts = messages;
    });
  }

  acceptable!: boolean;
  timeout: number = 5000;
  dismissible: boolean = true;
  dismissOnTimeout: number = 5000;

  onClosed(dismissedAlert: any): void {
    this.alertsService.remove(dismissedAlert);
  }

}
