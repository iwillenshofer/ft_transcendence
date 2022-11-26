import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { BehaviorSubject, min } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friend-stats',
  templateUrl: './friend-stats.component.html',
  styleUrls: ['./friend-stats.component.scss']
})
export class FriendStatsComponent {
	constructor(
			protected friendsService: FriendsService,
			protected alertService: AlertsService
		) {
		this.rating_image = new BehaviorSubject<string>('');
	 }

	public rating_image: BehaviorSubject<string>;


	imageClick() // REMOVE
	{
		let friend = this.friendsService.stats.value;
		if (friend?.rating)
			friend.rating += 10;
		this.friendsService.stats.next(friend);
	}

	getRankingImage(rating: number = 0): string {
		let max_rank = 2000;
		let min_rank = 400;
		let badges = 23;
		if(!rating) { rating = this.friendsService.stats.value?.rating || 0}
		if (rating <= min_rank) { rating = min_rank };
		if (rating >= max_rank) { rating = max_rank };

		rating = Math.floor((rating - min_rank) / ((max_rank - min_rank) / badges)) + 1;
		return ('/assets/images/ranking/' + rating + '.png');
	  }

	  ngOnInit(): void {
		this.friendsService.stats.subscribe(res => {
		  this.rating_image.next(this.getRankingImage(this.friendsService.stats.value?.rating));
		});
	  }
}
