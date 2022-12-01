import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatSocket } from '../components/chat/chat-socket';
import { UserInterface } from '../model/user.interface';

export const OFFLINE = 0;
export const ONLINE = 1;
export const INGAME = 2;
export const WATCHING = 3;
export interface UserI {
	username: string,
	status: string,
}

@Injectable({
	providedIn: 'root'
})
export class UsersOnlineService {
	public UsersOnline: Observable<UserInterface[]> = new Observable<UserInterface[]>()
	public statusSubject = new BehaviorSubject<Map<string, number>>(new Map());

	constructor(private socket: ChatSocket) { }

	users: UserI[] = []

	// setStatus(username: string, status: string) {
	// 	this.socket.on('chatStatus', (users: any) => {
	// 		this.users = users;
	// 	})
	// }


	getUsers() {
		this.socket.emit('getStatus')
	}

	updateChatStatus(res: UserInterface[]) {
		let users: Map<string, number> = this.statusSubject.value;
		let online_users: string[] = [];
		for (let item of res) {
			if ((users.has(item.username) && users.get(item.username) == OFFLINE) ||
				!(users.has(item.username)))
				users.set(item.username, ONLINE);
			online_users.push(item.username);
		}
		users.forEach((value: number, key: string) => {
			if (!(online_users.includes(key)))
				users.set(key, OFFLINE);
		});
		this.statusSubject.next(users);
	}

	setInGame(username: string) {
		let users: Map<string, number> = this.statusSubject.value;
		users.set(username, INGAME);
		this.statusSubject.next(users);
	}

	setWatching(username: string) {
		let users: Map<string, number> = this.statusSubject.value;
		users.set(username, WATCHING);
		this.statusSubject.next(users);
	}

	setOutGame(username: string) {
		let users: Map<string, number> = this.statusSubject.value;
		users.set(username, ONLINE);
		this.statusSubject.next(users);
	}

}
