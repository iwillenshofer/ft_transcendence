export const INITIAL_VELOCITY = 3;
export const MAX_SCORE = 10;
export const VELOCITY_INCREASE = 0.5;

interface IPlayer {
    socket: string,
    x: number,
    y: number,
    score: number,
    message: string
}

export class Game {

    constructor(gameId: string, powerUps: string) {
        this.gameID = gameId;
        this.powerUps = powerUps;
    }

    table = {
        width: 1280,
        height: 720
    };
    paddle = {
        width: 15,
        height: 150
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
    powerUp = {
        x: 0,
        y: 0,
        time: 0,
        show: false
    }
    ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
    velocity: number = INITIAL_VELOCITY;
    lastTouch: number = 0;
    lastTime!: number;
    currentAnimationFrameId?: number;
    finished: boolean = false;
    powerUps: string = '';

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
                    if (player.y < (this.table.height - this.paddle.height))
                        player.y += 30;
                    break;
            }
        }
    }

    ballUpdate(delta: number) {
        this.ball.x += this.ballDirection.x * this.velocity * delta;
        this.ball.y += this.ballDirection.y * this.velocity * delta;

        const rect = this.ballRect()

        if (rect.bottom >= this.table.height || rect.top <= 0) {
            this.ballDirection.y *= -1;
        }

        if (this.isCollision(this.rectP1(), rect)) {
            this.lastTouch = 1;
            this.ballDirection.x *= -1;
            this.ballRandomY();
            this.velocity += VELOCITY_INCREASE;
        }

        if (this.isCollision(this.rectP2(), rect)) {
            this.lastTouch = 2;
            this.ballDirection.x *= -1;
            this.ballRandomY();
            this.velocity += VELOCITY_INCREASE;
        }
    }

    rectP1() {
        let rect = {
            bottom: this.player1.y + this.paddle.height,
            top: this.player1.y,
            right: this.player1.x + this.paddle.width,
            left: this.player1.x,
        }
        return rect;
    }

    rectP2() {
        let rect = {
            bottom: this.player2.y + this.paddle.height,
            top: this.player2.y,
            right: this.player2.x + this.paddle.width,
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
        return rect.right >= this.table.width || rect.left <= 0;
    }

    handleLose() {
        let ballSide;
        const rect = this.ballRect();
        if (rect.right >= this.table.width) {
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
        this.ball.x = this.table.width / 2;
        this.ball.y = this.table.height / 2;
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
        this.player1.y = (this.table.height / 2) - (this.paddle.height / 2);
        this.player2.x = this.table.width - 30; // - 10 da margin
        this.player2.y = (this.table.height / 2) - (this.paddle.height / 2);
    }

    powerUpsUpdate() {
        // if (time == 0) {
        //     this.powerUp.x = this.randomNumberBetween(25, 535);
        //     this.powerUp.y = this.randomNumberBetween(0, 450);
        // }
        // time = 1;
        // this.resetPowerUp();
        // if (time - this.powerUp.time > 5000 && this.lastTouch)
        this.powerUp.show = true;
        // if (time - this.powerup.time > 5000 && this.ball.lastTouch) {
        //     this.powerup.display();
        // }
        // if (this.powerup.bg_color != 'black' && this.powerup.isCollision(this.ball.rect())) {
        //     let color = this.powerup.bg_color;
        //     switch (color) {
        //         case 'green':
        //             this.powerup.collid = "BIG PADDLE";
        //             if (this.ball.lastTouch == 1) {
        //                 this.player1Paddle.reset();
        //                 this.player1Paddle.height = 50;
        //             }
        //             if (this.ball.lastTouch == 2) {
        //                 anyPaddle.reset();
        //                 anyPaddle.height = 50;
        //             }
        //             break;
        //         case 'red':
        //             this.powerup.collid = "small paddle"
        //             if (this.ball.lastTouch == 1)
        //                 this.player1Paddle.height = 10;
        //             if (this.ball.lastTouch == 2)
        //                 anyPaddle.height = 10;
        //             break;
        //         case 'blue':
        //             this.powerup.collid = "BIG BALL"
        //             this.ball.size = 10;
        //             break;
        //         default:
        //             break;
        //     }
        //     this.powerup.collided(time);
        // }

        // if (time - this.powerup.time > 10000) {
        //     this.player1Paddle.height = 20;
        //     anyPaddle.height = 20;
        //     this.ball.size = 2;
        // }
    }

    // resetPowerUp() {
    //     this.powerUp.x = this.randomNumberBetween(25, 535);
    //     this.powerUp.y = this.randomNumberBetween(0, 450);
    //     this.powerUp.time = 0;
    //     this.powerUp.show = false;
    // }
}