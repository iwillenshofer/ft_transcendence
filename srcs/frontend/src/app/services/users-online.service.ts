import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterface } from '../model/user.interface';

export const OFFLINE = 0;
export const ONLINE = 1;
export const INGAME = 2;
export const WATCHING = 3;

@Injectable({
  providedIn: 'root'
})
export class UsersOnlineService {
  public UsersOnline: Observable<UserInterface[]> = new Observable<UserInterface[]>()
  public statusSubject = new BehaviorSubject<Map<string, number>>(new Map());

  constructor() {
  }

  updateChatStatus(res: UserInterface[]) {
	console.log('getting online users');
	console.log(JSON.stringify(res));
	let users: Map<string, number> = this.statusSubject.value;
	let online_users: string[] = [];
	for (let item of res)
	{
		if ((users.has(item.username) && users.get(item.username) == OFFLINE) ||
		!(users.has(item.username)))
			users.set(item.username, ONLINE);
		online_users.push(item.username);
	}
	users.forEach((value: number, key: string) => {
		if (!(online_users.includes(key)))
		users.set(key, OFFLINE);
		console.log("isonlineuser: " + key + " " + users.get(key));
	});
	console.log(online_users);
	console.log(users);
	console.log('end getting users');
	this.statusSubject.next(users);   
  }

  setInGame(username:string) {
	console.log('ingame ' + username);
	let users: Map<string, number> = this.statusSubject.value;
	users.set(username, INGAME);
	this.statusSubject.next(users);
	console.log(this.statusSubject.value);
}
 	
  setWatching(username:string) {
	console.log('outgame ' + username);
	let users: Map<string, number> = this.statusSubject.value;
	users.set(username, WATCHING);
	this.statusSubject.next(users);
  }

  setOutGame(username:string) {
	console.log('watchinggame ' + username);
	let users: Map<string, number> = this.statusSubject.value;
	users.set(username, ONLINE);
	this.statusSubject.next(users);
  }

}
