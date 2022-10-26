export const INITIAL_VELOCITY = 3;
export const MAX_SCORE = 10;
export const VELOCITY_INCREASE = 0.5;

interface IPlayer {
    socket: string,
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

    table = {
        width: 1280,
        height: 720
    };
    gameID: string;
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
    ball = {
        x: 0,
        y: 0,
        radius: 5
    }
    powerUp = {
        x: 0,
        y: 0,
        time: 0,
        show: false,
        type: 0,
        active: false,
    }
    ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
    velocity: number = INITIAL_VELOCITY;
    lastTouch: number = 0;
    finished: boolean = false;
    isCustom: string = '';

    gameStart() {
        this.resetPlayersPosition();
        this.resetBall();
        this.resetScore();
        this.update();
    }

    update() {
        this.ballUpdate();
        if (this.isCustom)
            this.powerUpUpdate()
        if (this.isLose())
            this.handleLose();
    }

    move(player: { socket: string; y: number; }, command: any) {
        let height: any;
        if (player.socket == this.player1.socket)
            height = this.player1.height;
        if (player.socket == this.player2.socket)
            height = this.player2.height;
        if (height) {
            switch (command) {
                case "up":
                    if (player.y > 0) {
                        player.y -= 30;
                    }
                    break;
                case "down":
                    if (player.y < (this.table.height - height))
                        player.y += 30;
                    break;
            }
        }
    }

    ballUpdate() {
        this.ball.x += this.ballDirection.x * this.velocity;
        this.ball.y += this.ballDirection.y * this.velocity;

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
            bottom: this.player1.y + this.player1.height,
            top: this.player1.y,
            right: this.player1.x + this.player1.width,
            left: this.player1.x,
        }
        return rect;
    }

    rectP2() {
        let rect = {
            bottom: this.player2.y + this.player2.height,
            top: this.player2.y,
            right: this.player2.x + this.player2.width,
            left: this.player2.x,
        }
        return rect;
    }

    ballRect() {
        let rect = {
            bottom: this.ball.y + this.ball.radius,
            top: this.ball.y - this.ball.radius,
            right: this.ball.x + this.ball.radius,
            left: this.ball.x - this.ball.radius,
        }
        return rect;
    }

    powerUpRect() {
        let rect = {
            bottom: this.powerUp.y + 100,
            top: this.powerUp.y,
            right: this.powerUp.x + 100,
            left: this.powerUp.x,
        }
        return rect;
    }

    isCollision(rect1: { bottom: any; top: any; right: any; left: any; }, rect2: { bottom: any; top: any; right: any; left: any; }) {
        return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
    }

    isLose() {
        const rect = this.ballRect();
        return rect.right >= this.table.width || rect.left <= 0;
    }

    handleLose() {
        let ballSide: any;
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
        this.resetPowers();
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
        this.player1.y = (this.table.height / 2) - (this.player1.height / 2);
        this.player2.x = this.table.width - 30; // - 10 da margin
        this.player2.y = (this.table.height / 2) - (this.player2.height / 2);
    }

    resetPlayerPosition(player: number) {
        if (player == 1)
            this.player1.y = (this.table.height / 2) - (this.player1.height / 2);
        else
            this.player2.y = (this.table.height / 2) - (this.player2.height / 2);
    }

    powerUpUpdate() {
        this.powerUp.time += 1;
        if (!this.powerUp.show && this.powerUp.time > 200 && this.lastTouch) {
            this.resetPowerUp();
            this.powerUp.show = true;
        }
        if (this.powerUp.show && this.powerUp.time > 5000) {
            this.resetPowerUp();
        }
        if (this.powerUp.show && this.isCollision(this.ballRect(), this.powerUpRect())) {
            this.resetPowerUp();
            this.powerUp.time = -3000;
            this.givePowerUp();
        }
    }

    resetPowerUp() {
        this.powerUp.x = this.randomNumberBetween(30, this.table.width - 130); // powerup size = 100
        this.powerUp.y = this.randomNumberBetween(0, this.table.height - 100);
        this.powerUp.time = 0;
        this.powerUp.show = false;
        this.powerUp.active = false;
    }

    resetPowers() {
        this.ball.radius = 5;
        this.player1.height = 150;
        this.player2.height = 150;
        this.resetPowerUp();
    }

    givePowerUp() {
        this.powerUp.active = true;
        let power = Math.round(this.randomNumberBetween(1, 3))
        let player;
        if (this.lastTouch == 1)
            player = this.player1
        else
            player = this.player2
        if (power == 1) {
            this.powerUp.type = power;
            this.ball.radius = 20;
        }
        else if (power == 2) {
            this.powerUp.type = power;
            player.height = 500;
            this.resetPlayerPosition(this.lastTouch);
        }
        else if (power == 3) {
            this.powerUp.type = power;
            player.height = 50;
        }
    }
}