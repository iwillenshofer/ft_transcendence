interface IPlayer {
    socket: any,
    x: number,
    y: number,
    score: number,
    message: string,
    width: number,
    height: number,
    username: string,
}

export class Game {
    constructor(gameId: string, custom: string) {
        this.gameID = gameId;
        this.isCustom = custom;
    }
    player1: IPlayer = {
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
    finished: boolean = false;
    gameID: string;
    isCustom: string = '';
    connected: number = 0;
    index: number = 0;
}