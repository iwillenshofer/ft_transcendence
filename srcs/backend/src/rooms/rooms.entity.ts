import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from 'src/users/users.entity';

@Entity({ name: "Rooms" })
@Unique(['id'])

export class RoomEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	users: UserEntity[];

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	updated_at: Date;
}
