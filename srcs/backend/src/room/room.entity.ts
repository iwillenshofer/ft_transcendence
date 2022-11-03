import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from 'src/user/user.entity';
import { RoomType } from "./room.interface";
import { UserInterface } from "src/user/user.interface";
import { MessageEntity } from "src/chat/message/message.entity";
import { MessageInterface } from "src/chat/message/message.interface";

@Entity({ name: "Room" })
@Unique(['id'])

export class RoomEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description?: string;

	@Column()
	type: RoomType;

	@Column()
	creatorId: number;

	@Column({ nullable: true })
	password: string;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	users: UserInterface[];

	@OneToMany(() => MessageEntity, (message) => message.room)
	@JoinTable()
	messages: MessageInterface[];

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;
}
