import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FriendsService } from '../friends.service';

@Component({
  selector: 'app-friend-stats',
  templateUrl: './friend-stats.component.html',
  styleUrls: ['./friend-stats.component.scss']
})
export class FriendStatsComponent {
	constructor(protected friendsService: FriendsService) {
		this.rating_image = new BehaviorSubject<string>('');
	 }

	public rating_image: BehaviorSubject<string>;


	getRankingImage(rating: number = 0): string {
		if(!rating) { rating = this.friendsService.stats.value?.rating || 0}
		if (rating <= 100) { rating = 0 };
		if (rating >= 2200) { rating = 2000 };
		rating = Math.floor((24 * rating) / 2000);
		return ('/assets/images/ranking/' + rating + '.png');
	  }

	  ngOnInit(): void {
		this.friendsService.stats.subscribe(res => {
		  this.rating_image.next(this.getRankingImage(this.friendsService.stats.value?.rating));
		});
	  }
}
