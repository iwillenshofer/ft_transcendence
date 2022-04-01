import { User } from './users.entity';

export class UserDTO {	
	id: number;
	username: string;
	fullname: string;
	tfa_fulfilled?: boolean = false;
	tfa_enabled?: boolean = false;

	constructor(id: number = 0, username: string = '', fullname: string = '')
	{
		this.id = id;
		this.username = username;
		this.fullname = fullname;
	}

	public static from(dto: Partial<UserDTO>)
	{
		const user = new UserDTO();
		user.id = dto.id;
		user.username = dto.username;
		user.fullname = dto.fullname;
		return (user);
	}

	public static fromEntity(entity: User) {
		const user = new UserDTO();
		user.id = entity.id;
		user.username = entity.username;
		user.fullname = entity.fullname;
		user.tfa_enabled = entity.tfa_enabled;	
		return (user);
	}

	public toEntity() {
		const user = new User();
		user.id = this.id;
		user.username = this.username;
		user.fullname = this.fullname;		
		return (user);
	}
}
