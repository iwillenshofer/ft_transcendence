import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertModel } from './alerts.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  alertsSubject: BehaviorSubject<AlertModel[]> = new BehaviorSubject<AlertModel[]>([]);
  alerts: AlertModel[] = [];
  acceptable: boolean = false;

  private alert(newAlert: AlertModel): void {
    this.alertsSubject.next([...this.alertsSubject.getValue(), newAlert]);
    this.alerts = [...this.alerts, newAlert];
  }

  getAlerts(): Observable<AlertModel[]> {
    return this.alertsSubject;
  }

  danger(message: string) {
    this.clear();
    this.alert({ type: "danger", msg: message });
  }

  info(message: string) {
    this.alert({ type: "info", msg: message });
  }

  warning(message: string) {
    this.alert({ type: "warning", msg: message });
  }

  success(message: string) {
    this.alert({ type: "success", msg: message });
  }

  clear() {
    this.alertsSubject.next([]);
    this.alerts = [];
  }

  remove(removedAlert: any): void {
    // console.log('removed alert');
    this.alerts = this.alerts.filter(alert => alert !== removedAlert);
    this.alertsSubject.next(this.alerts);
  }

  challenge(challenger: any, username: any) {
    this.acceptable = true;
    let msg = challenger + ' challenged you';
    this.alert({ type: "success", msg: msg });
  }
}
