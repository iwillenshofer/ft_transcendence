import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService {

  challenged: any;


  constructor() { }

  challenge(username: any) {
    this.challenged = username;
  }
}
