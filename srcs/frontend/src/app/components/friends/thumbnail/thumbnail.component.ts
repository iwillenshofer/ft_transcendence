import { Component, Input } from '@angular/core';
import { UsersOnlineService } from 'src/app/services/users-online.service';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent {

	constructor(
		protected onlineService: UsersOnlineService,
		protected friendService: FriendsService
		) {}

	@Input() username: string = '';
	@Input() avatar: string = '';
	@Input() size: string = 'medium';
}
