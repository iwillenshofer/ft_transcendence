import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IconDefinition, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FriendsService } from '../friends.service';
import { OnlineGameService } from '../../game/online-game.service';
import { UsersOnlineService } from 'src/app/services/users-online.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {

  constructor(protected friendsService: FriendsService, protected gameService: OnlineGameService, protected router: Router, 	protected onlineService: UsersOnlineService) { }
  searchIcon: IconDefinition = faMagnifyingGlass;

  private onlineUsers: Map<string, number> = new Map<string, number>();
  getOnline(username: string): string
  {
	console.log("getting online comp. for " + username + ":::" + this.onlineUsers.get(username) );
	console.log(this.onlineUsers);
	if (!(this.onlineUsers.get(username) ?? 0))
		return 'offline';
	else if( this.onlineUsers.get(username) == 2)
		return 'ongame';
	else if( this.onlineUsers.get(username) == 3)
		return 'watching';
	else
		return 'online';
  }

  ngOnInit(): void {
	this.onlineService.statusSubject.subscribe((val) => {
		this.onlineUsers = val;
	});
  }

  updateUserList(event: any) {
    const search: string = event.target.value;
    this.friendsService.filterUserList(search);
  }

  challenge(player: any) {
    this.gameService.challenge(player);
  }
}
