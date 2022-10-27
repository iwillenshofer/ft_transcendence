interface IPlayer {
    socket: any,
    x: number,
    y: number,
    score: number,
    message: string,
    width: number,
    height: number
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
    };
    player2: IPlayer = {
        socket: '',
        x: 0,
        y: 0,
        score: 0,
        message: '',
        width: 15,
        height: 150,
    };
    finished: boolean = false;
    gameID: string;
    isCustom: string = '';
}