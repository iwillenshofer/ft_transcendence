import { Column, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, JoinTable, JoinColumn, OneToMany, ManyToOne} from "typeorm";
import { UserEntity } from "src/users/users.entity";


@Entity({ name: "Friends" })
@Unique(['id'])
export class FriendsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, user1 => user1.id)
    @JoinColumn()
    user1: UserEntity;

    @ManyToOne(() => UserEntity, user2 => user2.id)
    @JoinColumn()
    user2: UserEntity;

    @Column()
    accepted: boolean;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}