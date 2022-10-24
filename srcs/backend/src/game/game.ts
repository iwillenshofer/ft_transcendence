export const INITIAL_VELOCITY = 3;
export const MAX_SCORE = 2;

interface IPlayer {
    socket: string,
    x: number,
    y: number,
    score: number,
    message: string
}

export class Game {

    constructor(gameId: string) {
        this.gameID = gameId;
    }

    gameID: string;
    player1: IPlayer = {
        socket: '',
        x: 0,
        y: 0,
        score: 0,
        message: ''
    };
    player2: IPlayer = {
        socket: '',
        x: 0,
        y: 0,
        score: 0,
        message: ''
    };
    ball = {
        x: 0,
        y: 0,
    }
    ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
    velocity: number = INITIAL_VELOCITY;
    lastTouch: number = 0;
    lastTime!: number;
    currentAnimationFrameId?: number;
    finished: boolean = false;

    gameStart() {
        this.resetPlayersPosition();
        this.resetBall();
        this.resetScore();
    }

    move(player, command) {
        if (player.socket == this.player1.socket || player.socket == this.player2.socket) {
            switch (command) {
                case "up":
                    if (player.y > 0) {
                        player.y -= 30;
                    }
                    break;
                case "down":
                    if (player.y < 400)
                        player.y += 30;
                    break;
            }
        }
    }

    ballUpdate(delta: number) {
        this.ball.x += this.ballDirection.x * this.velocity * delta;
        this.ball.y += this.ballDirection.y * this.velocity * delta;
        this.velocity += 0.000003;

        const rect = this.ballRect()

        if (rect.bottom >= 500 || rect.top <= 0) {
            this.ballDirection.y *= -1;
        }

        if (this.isCollision(this.rectP1(), rect)) {
            this.lastTouch = 1;
            this.ballDirection.x *= -1;
            this.ballRandomY();
        }

        if (this.isCollision(this.rectP2(), rect)) {
            this.lastTouch = 2;
            this.ballDirection.x *= -1;
            this.ballRandomY();
        }
    }

    rectP1() {
        let rect = {
            bottom: this.player1.y + 100,
            top: this.player1.y,
            right: this.player1.x + 10,
            left: this.player1.x,
        }
        return rect;
    }

    rectP2() {
        let rect = {
            bottom: this.player2.y + 100,
            top: this.player2.y,
            right: this.player2.x + 10,
            left: this.player2.x,
        }
        return rect;
    }

    ballRect() {
        let rect = {
            bottom: this.ball.y + 5,
            top: this.ball.y - 5,
            right: this.ball.x + 5,
            left: this.ball.x - 5,
        }
        return rect;
    }

    isCollision(rect1, rect2) {
        return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
    }

    isLose() {
        const rect = this.ballRect();
        return rect.right >= 560 || rect.left <= 0;
    }

    handleLose() {
        let ballSide;
        const rect = this.ballRect();
        if (rect.right >= 560) {
            this.player1.score += 1;
            ballSide = -1;
        }
        if (rect.left <= 0) {
            this.player2.score += 1;
            ballSide = 1;
        }
        if (this.player1.score == MAX_SCORE) {
            this.finished = true;
            this.player1.message = 'Winner';
            this.player2.message = 'Loser';
        }
        else if (this.player2.score == MAX_SCORE) {
            this.finished = true;
            this.player1.message = 'Loser';
            this.player2.message = 'Winner';
        }
        this.resetPlayersPosition()
        this.resetBall();
        this.ballDirection.x *= ballSide;
    }

    resetBall() {
        this.ball.x = 280;
        this.ball.y = 250;
        this.ballDirection.x = 200;
        this.ballDirection.y = 200;
        this.velocity = INITIAL_VELOCITY;
        this.ballRandomX();
        this.ballRandomY();
    }

    resetScore() {
        this.player1.score = 0;
        this.player2.score = 0;
    }

    ballRandomX() {
        this.ballDirection.x = Math.cos(this.randomNumberBetween(0.2, 0.9));
    }

    ballRandomY() {
        this.ballDirection.y = Math.sin(this.randomNumberBetween(0, 2 * Math.PI));
    }

    randomNumberBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    resetPlayersPosition() {
        this.player1.x = 20;
        this.player1.y = 200;
        this.player2.x = 535;
        this.player2.y = 200;
    }
}