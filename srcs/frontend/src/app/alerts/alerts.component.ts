import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { AlertModel } from './alerts.model';
import { AlertsService } from './alerts.service';
import io from "socket.io-client";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

export class AlertsComponent implements OnInit {

  socket: any;

  constructor(
    private alertsService: AlertsService,
    private auth: AuthService,
    private router: Router,
  ) { }
  alerts: AlertModel[] = [];

  ngOnInit(): void {
    this.alertsService.getAlerts().subscribe(messages => {
      this.alerts = messages;
    });
    this.socket = io("http://localhost:3000/game");
    let username: any;
    this.auth.getUser().then(data => {
      username = data.username;
    });
    this.socket.on("notifyChallenge", (challenger: any, challenged: any) => {
      if (challenged == username) {
        this.alertsService.challenge(challenger,
          {
            accept_click: () => {
              console.log('accept')
            },
            deny_click: () => {
              this.alertsService.cancelchallenge(challenger);
              this.socket.emit("cancelChallenge", challenger, username)
            }
          }
        );
      }
    });
    this.socket.on("removeChallenge", (challenger: any, challenged: any) => {
      if (challenged == username) {
        this.alertsService.cancelchallenge(challenger);
      }
      if (challenger == username) {
        this.router.navigate(['/']);
        this.alertsService.warning(challenged + ' refused your challenge')
      }
    });
  }

  onClosed(dismissedAlert: any): void {
    this.alertsService.remove(dismissedAlert);
  }

}
