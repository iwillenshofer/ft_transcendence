export class HistoryDTO {
	user1: string;
	user2: string;
	user1_avatar_url: string;
	user2_avatar_url: string;
	score_p1: number;
	score_p2: number
	winner: string;
}
export class AchievementDTO {
	achievement: string;
	description: string;
}

export class StatsDTO {
	username: string;
	fullname: string;
	avatar_url: string;
	created_at: any;
	rating: number;
	achievements: AchievementDTO[];
	history: HistoryDTO[];
}

