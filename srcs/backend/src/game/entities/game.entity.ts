import { UserEntity } from 'src/users/users.entity';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

export class GameEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    playerOne: UserEntity;

    @Column()
    playerTwo: UserEntity;

    @Column()
    playerOneScore: number;

    @Column()
    playerTwoScore: number;

    // @Column("int")
    // @ManyToOne(() => UserEntity, user => user.gamesPlayed)
    // @JoinColumn({ name: "gamesPlayed" })
    // public gamesPlayed: UserEntity;

    @Column()
    isDefault: boolean;
}