export const INITIAL_VELOCITY = 3;
export const MAX_SCORE = 1;
export const VELOCITY_INCREASE = 1;

let table = {
    width: 1280,
    height: 720
};
export let player1 = {
    socket: '',
    x: 0,
    y: 0,
    score: 0,
    message: '',
    width: 15,
    height: 150,
};

export let player2 = {
    socket: '',
    x: 0,
    y: 0,
    score: 0,
    message: '',
    width: 15,
    height: 150,
};

export let ball = {
    x: 0,
    y: 0,
    radius: 5

}
export let powerUp = {
    x: 0,
    y: 0,
    time: 0,
    show: false,
    type: 0,
    active: false,
}

export let gameID: any;

let isP1 = false;
let mode = '';
let ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
let velocity: number = INITIAL_VELOCITY;
let lastTouch: number = 0;
let finished: boolean = false;
export let isCustom: boolean;
export let _socket: any;

export function setGameSocket(socket: any) {
    _socket = socket;
}

export function gameStart() {
    resetPlayersPosition();
    resetBall();
    resetScore();
    update();
}

export function update() {
    ballUpdate();
    syncPowerUp()
    paddleUpdate();
    if (isCustom)
        powerUpUpdate()
    if (isLose())
        handleLose();
}

function paddleUpdate() {
    _socket.on('updatePaddle', (Player1: any, Player2: any) => {
        player1 = Player1;
        player2 = Player2;
    })
}

window.onkeydown = function move(e) {
    if (player1 && player2 && mode != 'spec') {
        if (e.key == 'w' || e.key == 'W' || e.key == 'ArrowUp') {
            _socket.emit("move", gameID, player1, player2, "up");
        }
        if (e.key == 's' || e.key == 'S' || e.key == 'ArrowDown') {
            _socket.emit("move", gameID, player1, player2, "down");
        }
    }
    if (finished || mode == 'spec') {
        if (e.key == 'q' || e.key == 'Q' || e.key == 'Escape')
            location.reload();
    }
}

function ballUpdate() {
    ball.x += ballDirection.x * velocity;
    ball.y += ballDirection.y * velocity;
    syncBall();

    const rect = ballRect()

    if (rect.bottom >= table.height || rect.top <= 0) {
        ballDirection.y *= -1;
    }

    if (isCollision(rectP1(), rect)) {
        lastTouch = 1;
        ballDirection.x *= -1;
        ballRandomY();
        velocity += VELOCITY_INCREASE;
    }

    if (isCollision(rectP2(), rect)) {
        lastTouch = 2;
        ballDirection.x *= -1;
        ballRandomY();
        velocity += VELOCITY_INCREASE;
    }
}

function rectP1() {
    let rect = {
        bottom: player1.y + player1.height,
        top: player1.y,
        right: player1.x + player1.width,
        left: player1.x,
    }
    return rect;
}

function rectP2() {
    let rect = {
        bottom: player2.y + player2.height,
        top: player2.y,
        right: player2.x + player2.width,
        left: player2.x,
    }
    return rect;
}

function ballRect() {
    let rect = {
        bottom: ball.y + ball.radius,
        top: ball.y - ball.radius,
        right: ball.x + ball.radius,
        left: ball.x - ball.radius,
    }
    return rect;
}

function powerUpRect() {
    let rect = {
        bottom: powerUp.y + 100,
        top: powerUp.y,
        right: powerUp.x + 100,
        left: powerUp.x,
    }
    return rect;
}

function isCollision(rect1: { bottom: any; top: any; right: any; left: any; }, rect2: { bottom: any; top: any; right: any; left: any; }) {
    return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;
}

function isLose() {
    const rect = ballRect();
    return rect.right >= table.width || rect.left <= 0;
}

function handleLose() {
    let ballSide: any;
    const rect = ballRect();
    if (rect.right >= table.width) {
        player1.score += 1;
        isGameFinished();
        if (isP1) {
            _socket.emit('score', gameID, player1.score, player2.score, finished);
        }
        ballSide = -1;
    }
    if (rect.left <= 0) {
        player2.score += 1;
        isGameFinished();
        if (isP1) {
            _socket.emit('score', gameID, player1.score, player2.score, finished);
        }
        ballSide = 1;
    }
    resetPowers();
    resetPlayersPosition()
    resetBall();
    ballDirection.x *= ballSide;
}

function isGameFinished() {
    if (player1.score == MAX_SCORE) {
        finished = true;
        player1.message = 'Winner';
        player2.message = 'Loser';
    }
    else if (player2.score == MAX_SCORE) {
        finished = true;
        player1.message = 'Loser';
        player2.message = 'Winner';
    }
}

function resetBall() {
    ball.x = table.width / 2;
    ball.y = table.height / 2;
    velocity = INITIAL_VELOCITY;
    ballRandomX();
    ballRandomY();
}

function resetScore() {
    player1.score = 0;
    player2.score = 0;
}

function syncBall() {
    if (isP1) {
        _socket.emit('randomBall', gameID, ball, ballDirection);
    }
    if (!isP1) {
        _socket.on('ball', (newBall: any, ballDir: any) => {
            ball = newBall;
            ballDirection = ballDir;
        })
    }
}

function ballRandomX() {
    if (isP1)
        ballDirection.x = Math.cos(randomNumberBetween(0.2, 0.9));
}

function ballRandomY() {
    if (isP1)
        ballDirection.y = Math.sin(randomNumberBetween(0, 2 * Math.PI));
}

function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function resetPlayersPosition() {
    player1.x = 20;
    player1.y = (table.height / 2) - (player1.height / 2);
    player2.x = table.width - 30; // - 10 da margin
    player2.y = (table.height / 2) - (player2.height / 2);
}

function resetPlayerPosition(player: number) {
    if (player == 1)
        player1.y = (table.height / 2) - (player1.height / 2);
    else
        player2.y = (table.height / 2) - (player2.height / 2);
}

function powerUpUpdate() {
    powerUp.time += 1;
    if (!powerUp.show && powerUp.time > 200 && lastTouch) {
        resetPowerUp();
        powerUp.show = true;
    }
    if (powerUp.show && powerUp.time > 5000) {
        resetPowerUp();
    }
    if (powerUp.show && isCollision(ballRect(), powerUpRect())) {
        resetPowerUp();
        powerUp.time = -1000;
        givePowerUp();
    }
}

function resetPowerUp() {
    if (isP1) {
        powerUp.x = randomNumberBetween(30, table.width - 130); // powerup size = 100
        powerUp.y = randomNumberBetween(0, table.height - 100);
        powerUp.time = 0;
        powerUp.show = false;
        powerUp.active = false;
    }
    syncPowerUp();
}

function syncPowerUp() {
    if (isP1)
        _socket.emit('powerUp', gameID, powerUp);
    else {
        _socket.on('updatePowerUp', (newPowerUp: any) => {
            powerUp = newPowerUp;
        })
    }
}

function resetPowers() {
    ball.radius = 5;
    player1.height = 150;
    player2.height = 150;
    resetPowerUp();
}

function givePowerUp() {
    powerUp.active = true;
    let power = Math.round(randomNumberBetween(1, 4))
    let player;
    if (lastTouch == 1)
        player = player1
    else
        player = player2
    if (power == 1) {
        powerUp.type = power;
        ball.radius = 20;
    }
    else if (power == 2) {
        powerUp.type = power;
        player.height = 500;
        resetPlayerPosition(lastTouch);
    }
    else if (power == 3) {
        powerUp.type = power;
        player.height = 50;
    }
    syncPowerUp();
}

export function setP1Socket(socket: any) {
    player1.socket = socket;
}
export function setP2Socket(socket: any) {
    player2.socket = socket;
}

export function f_isP1(is: boolean) {
    isP1 = is;
}

export function setGameID(id: any) {
    gameID = id
}

export function setMode(mod: any) {
    mode = mod;
}

export function setCustom(custom: boolean) {
    isCustom = custom;
}
