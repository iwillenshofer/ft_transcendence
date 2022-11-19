import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FriendsService } from './friends.service';
import { GameHistoryComponent } from './game-history/game-history.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  constructor(
    protected friendsService: FriendsService,
    private authService: AuthService,
    ) {  }  


  ngOnInit(): void {
    if (!(this.friendsService.selectedUser.value)) {
      this.friendsService.selectedUser.next( this.authService.userSubject.value?.username );
    }
    this.friendsService.selectedUser.subscribe(res => {
      this.friendsService.update();
    });
  }

}
