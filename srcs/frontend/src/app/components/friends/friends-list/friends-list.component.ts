import { Component, OnInit } from '@angular/core';
import { IconDefinition, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {

  constructor(protected friendsService: FriendsService) { }
  searchIcon: IconDefinition = faMagnifyingGlass;

  ngOnInit(): void {
  }

  updateUserList(event: any) {
    const search: string = event.target.value;
    this.friendsService.filterUserList(search);
  }


}
