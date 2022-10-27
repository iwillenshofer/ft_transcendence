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
    finished: boolean = false;
    gameID: string;
    isCustom: string = '';
}