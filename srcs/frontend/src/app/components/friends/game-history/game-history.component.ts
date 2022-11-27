import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent implements OnInit {

  constructor(protected friendsService: FriendsService) { }
  
  ngOnInit(): void {}

  getScoreClass(user1: string, user2: string, score1: number, score2: number) {
    if ((user1 == this.friendsService.selectedUser.value && score1 > score2)
    || (user2 == this.friendsService.selectedUser.value && score2 > score1))
    {
      return ({'game-won': true});
    }
    return ({'game-lost': true});
  }

  
}
