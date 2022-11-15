import { RoomEntity } from 'src/chat/models/room.entity';
import { GameEntity } from 'src/game/game.entity';
import { BaseEntity, Entity, Unique, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';

@Entity({ name: 'User' })
@Unique(['id'])
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ nullable: false, type: 'integer' })
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  username: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  fullname: string;

  @Column({ nullable: false, type: 'varchar', length: 2048 })
  avatar_url: string;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  refreshtoken: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  tfa_enabled: boolean;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  tfa_code: string;

  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[];

  @Column({ type: 'int', default: 800 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: false, type: 'boolean', default: false })
  tfa_fulfilled: boolean; // MUST BE REMOVED AFTER CREATING DTO
}
