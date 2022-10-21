import { UserEntity } from 'src/users/users.entity';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

export class GameEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    player1: any = null;

    @Column()
    player2: any = null;

    @Column()
    positionP1: {
        x: number,
        y: number
    };

    @Column()
    positionP2: {
        x: number,
        y: number
    };

    @Column()
    scoreP1: number;

    @Column()
    scoreP2: number;

    @Column()
    isDefault: boolean;
}