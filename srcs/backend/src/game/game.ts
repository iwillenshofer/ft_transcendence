import { IPlayer } from "./game.interface";

export class Game {
    constructor(gameId: string, custom: string) {
        this.gameID = gameId;
        this.isCustom = custom;
    }

    player1: IPlayer = {
        id: 0,
        socket: '',
        x: 0,
        y: 0,
        score: 0,
        message: '',
        width: 15,
        height: 150,
        username: ''
    };
    player2: IPlayer = {
        id: 0,
        socket: '',
        x: 0,
        y: 0,
        score: 0,
        message: '',
        width: 15,
        height: 150,
        username: ''
    };
    ball = {
        x: 0,
        y: 0,
        radius: 5,
        velocity: 0,
        direction: {
            x: 0.0,
            y: 0.0
        }
    }
    powerUp = {
        x: 0,
        y: 0,
        time: 0,
        show: false,
        type: 0,
        active: false,
    }
    finished: boolean = false;
    gameID: string;
    isCustom: string = '';
    connected: number = 0;
    index: number = 0;
    winner: IPlayer;
}