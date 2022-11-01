export const INITIAL_VELOCITY = 5;
export const MAX_SCORE = 10;
export const VELOCITY_INCREASE = 0.5;

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
    username: '',
};

export let player2 = {
    socket: '',
    x: 0,
    y: 0,
    score: 0,
    message: '',
    width: 15,
    height: 150,
    username: '',
};

export let ball = {
    x: 0,
    y: 0,
    radius: 5,
    velocity: 0,
    direction: {
        x: 0.0,
        y: 0.0
    }
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
let started = false;
let mode = '';
let lastTouch: number = 0;
let finished: boolean = false;
export let isCustom: boolean;
export let _socket: any;

export function setGameSocket(socket: any) {
    _socket = socket;
}

export function gameStart() {
    if (!started) {
        resetPlayersPosition();
        resetBall();
        resetScore();
        syncScore();
        started = true;
        syncBall();
    }
}

export function update() {
    ballUpdate();
    paddleUpdate();
    if (isCustom)
        powerUpUpdate()
    syncPowerUp()
    if (isLose())
        handleLose();
    syncBall();
}

function paddleUpdate() {
    _socket.once('updatePaddle', (Player1: any, Player2: any) => {
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
    if (!started || finished || mode == 'spec') {
        if (e.key == 'q' || e.key == 'Q' || e.key == 'Escape')
            location.reload();
    }
}

function ballUpdate() {
    ball.x += ball.direction.x * ball.velocity;
    ball.y += ball.direction.y * ball.velocity;

    const rect = ballRect()

    if (rect.bottom >= table.height || rect.top <= 0) {
        ball.direction.y *= -1;
    }

    if (isCollision(rectP1(), rect)) {
        lastTouch = 1;
        ball.direction.x *= -1;
        ballRandomY();
        ball.velocity += VELOCITY_INCREASE;
    }

    if (isCollision(rectP2(), rect)) {
        lastTouch = 2;
        ball.direction.x *= -1;
        ballRandomY();
        ball.velocity += VELOCITY_INCREASE;
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

let lastPoint = 0;

function isLose() {
    let newPoint = (new Date()).getTime();
    const rect = ballRect();
    if (newPoint - lastPoint < 1000)
        return false;
    else
        lastPoint = newPoint;
    return rect.right >= table.width || rect.left <= 0;
}

function handleLose() {
    let ballSide: any;
    const rect = ballRect();
    if (rect.left <= 0) {
        player2.score += 1;
        ballSide = 1;
    }
    if (rect.right >= table.width) {
        player1.score += 1;
        ballSide = -1;
    }
    isGameFinished();
    resetPowers();
    resetPlayersPosition()
    resetBall();
    ball.direction.x *= ballSide;
    _socket.emit('score', gameID, player1.score, player2.score, finished);
    _socket.once("updateScore", (scoreP1: any, scoreP2: any, finish: any) => {
        player1.score = scoreP1;
        player2.score = scoreP2;
        finished = finish;
    })
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
    ball.velocity = INITIAL_VELOCITY;
    ballRandomX();
    ballRandomY();
    syncBall();
}

function resetScore() {
    player1.score = 0;
    player2.score = 0;
    _socket.emit('score', gameID, player1.score, player2.score, finished);
}

function syncScore() {
    _socket.emit('syncScore', gameID);
    _socket.once('updateScore', (scoreP1: any, scoreP2: any, finish: any) => {
        player1.score = scoreP1;
        player2.score = scoreP2;
        finished = finish;
    })
}

function syncBall() {
    _socket.emit('syncBall', gameID, ball);
    _socket.once('ball', (newBall: any) => {
        ball = newBall;
    })
}

function ballRandomX() {
    let num = Math.cos(randomNumberBetween(0.2, 0.9));
    ball.direction.x = Math.round(num * 10) / 10;
    syncBall();
}

function ballRandomY() {
    let num = Math.sin(randomNumberBetween(0, 2 * Math.PI));
    ball.direction.y = Math.round(num * 10) / 10;
    syncBall();
}

function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function resetPlayersPosition() {
    player1.x = 20;
    player1.y = (table.height / 2) - (player1.height / 2);
    player2.x = table.width - 30; // - 10 da margin
    player2.y = (table.height / 2) - (player2.height / 2);
    _socket.emit('setPaddles', gameID, player1, player2);
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
    powerUp.x = randomNumberBetween(30, table.width - 130); // powerup size = 100
    powerUp.y = randomNumberBetween(0, table.height - 100);
    powerUp.time = 0;
    powerUp.show = false;
    powerUp.active = false;
    syncPowerUp();
}

function syncPowerUp() {
    _socket.emit('powerUp', gameID, powerUp);
    _socket.once('updatePowerUp', (newPowerUp: any) => {
        powerUp = newPowerUp;
    })
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

export function setGameID(id: any) {
    gameID = id
}

export function setMode(mod: any) {
    mode = mod;
}

export function setCustom(custom: boolean) {
    isCustom = custom;
}

export function setP1Username(username: string) {
    player1.username = username;
}

export function setP2Username(username: string) {
    player2.username = username;
}