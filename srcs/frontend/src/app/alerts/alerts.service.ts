import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertModel } from './alerts.model';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  alertsSubject: BehaviorSubject<AlertModel[]> = new BehaviorSubject<AlertModel[]>([]);

  private alert(newAlert: AlertModel): void {
    this.alertsSubject.next([...this.alertsSubject.getValue(), newAlert]);
  }

  getAlerts(): Observable<AlertModel[]> {
    return this.alertsSubject;
  }

  danger(message: string) {
    this.clear();
    this.alert(new AlertModel({ type: 'danger', msg: message }));
  }

  info(message: string) {
    this.alert(new AlertModel({ type: 'info', msg: message }));
  }

  warning(message: string) {
    this.alert(new AlertModel({ type: 'warning', msg: message }));
  }

  success(message: string) {
    this.alert(new AlertModel({ type: 'success', msg: message }));
  }

  clear() {
    this.alertsSubject.next([]);
  }

  remove(removedAlert: any): void {
    let alerts: AlertModel[] = this.alertsSubject.value;
    alerts = alerts.filter(alert => alert !== removedAlert);
    this.alertsSubject.next(alerts);
  }

  challenge(challenger: any, username: any) {
    let msg = challenger + ' challenged you';
    this.alert(AlertModel.fromChallenge(challenger, username, msg));
  }

  cancelchallenge(challenger: any, username: any) {
    let alerts: AlertModel[] = this.alertsSubject.value;
      alerts.forEach( (item, index) => {
        if(item.challenger === challenger && item.username === username) {
          alerts.splice(index,1);
        };
      });
      this.alertsSubject.next(alerts);
  }

}
