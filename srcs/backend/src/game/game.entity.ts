import { IPlayer } from './game.interface';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "Games" })
@Unique(['id'])
export class GameEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    usernameP1: string;

    @Column()
    usernameP2: string;

    @Column()
    idP1: number;

    @Column()
    idP2: number;

    @Column()
    scoreP1: number;

    @Column()
    scoreP2: number;

    @Column()
    isCustom: string;

    @Column()
    winner: number;
}