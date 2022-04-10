import { RoomEntity } from 'src/chat/models/room.entity';
import { UserEntity } from 'src/users/users.entity';
import { BeforeInsert, BeforeRecover, BaseEntity, Entity, Unique, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import * as crypto from 'crypto';
import { promisify } from 'util';

@Entity({ name: 'Auth' })
@Unique(['id'])
export class AuthEntity extends BaseEntity {
		@PrimaryGeneratedColumn()
    id: number;

		@ManyToOne(() => UserEntity)
		@JoinColumn()
		user: UserEntity;

		@Column({ type: 'varchar'})
    hash: string;

		@Column({ nullable: false, type: 'boolean', default: false })
    used: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
