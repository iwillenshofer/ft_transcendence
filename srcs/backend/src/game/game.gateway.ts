import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

export const INITIAL_VELOCITY = 3;
export const MAX_SCORE = 10;

@WebSocketGateway({ cors: '*:*', namespace: 'game' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  player1: any;
  positionP1 = {
    x: 0,
    y: 0,
  };
  scoreP1: number = 11;
  player2: any;
  positionP2 = {
    x: 0,
    y: 0,
  };
  scoreP2: number = 11;
  ball = {
    x: 0,
    y: 0,
  }
  ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
  velocity: number = INITIAL_VELOCITY;
  lastTouch: number = 0;

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    console.log('game', client.id);
    this.resetBall();
    this.resetScore();
    this.setPlayers(client.id);
    this.server.emit("players", this.player1, this.player2);
  }

  @SubscribeMessage('move')
  move(client: Socket, command: string) {
    let position;
    if (client.id == this.player1) {
      position = this.positionP1;
    }
    if (client.id == this.player2) {
      position = this.positionP2;
    }
    if (client.id == this.player1 || client.id == this.player2) {
      switch (command) {
        case "up":
          if (position.y > 0) {
            position.y -= 30;
          }
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
        case "down":
          if (position.y < 400)
            position.y += 30;
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
      }
    }
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    if (client.id == this.player1) {
      this.player1 = null;
      // console.log('player1 disconnected')
      this.resetPlayersPosition();
    }
    else if (client.id == this.player2) {
      this.player2 = null;
      // console.log('player2 disconnected')
      this.resetPlayersPosition();
    }
  }

  setPlayers(clientId) {
    if (!this.player1) {
      this.player1 = clientId;
      // console.log('player1 connected')
    }
    else if (!this.player2) {
      this.player2 = clientId;
      // console.log('player2 connected')
      this.resetPlayersPosition();
    }
    else {
      // console.log('spec')
    }
  }

  resetPlayersPosition() {
    this.positionP1.x = 20;
    this.positionP1.y = 200;
    this.positionP2.x = 535;
    this.positionP2.y = 200;
  }

  lastTime!: number;
  currentAnimationFrameId?: number;

  @SubscribeMessage('gameUpdate')
  update(client: Socket, time: number) {
    if (this.lastTime) {
      const delta = time - this.lastTime;
      this.ballUpdate(time);
      this.server.emit("draw", this.ball, this.positionP1, this.positionP2);
    }
    if (this.isLose())
      this.handleLose();
    this.lastTime = time;
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
      bottom: this.positionP1.y + 100,
      top: this.positionP1.y,
      right: this.positionP1.x + 10,
      left: this.positionP1.x,
    }
    return rect;
  }

  rectP2() {
    let rect = {
      bottom: this.positionP2.y + 100,
      top: this.positionP2.y,
      right: this.positionP2.x + 10,
      left: this.positionP2.x,
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
    let finished = false;
    let finishedMessageP1;
    let finishedMessageP2;
    const rect = this.ballRect();
    if (rect.right >= 560) {
      this.scoreP1 += 1;
      ballSide = -1;
    }
    if (rect.left <= 0) {
      this.scoreP2 += 1;
      ballSide = 1;
    }
    if (this.scoreP1 == MAX_SCORE) {
      finished = true;
      finishedMessageP1 = 'Winner';
      finishedMessageP2 = 'Loser';
    }
    else if (this.scoreP2 == MAX_SCORE) {
      finished = true;
      finishedMessageP1 = 'Loser';
      finishedMessageP2 = 'Winner';
    }
    this.resetPlayersPosition()
    this.resetBall();
    this.ballDirection.x *= ballSide;
    this.server.to(this.player1).emit("score", this.scoreP1, this.scoreP2, finished, finishedMessageP1);
    this.server.to(this.player2).emit("score", this.scoreP1, this.scoreP2, finished, finishedMessageP2);
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
    this.scoreP1 = 0;
    this.scoreP2 = 0;
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

}

/*
      https://www.youtube.com/watch?app=desktop&v=atbdpX4CViM
      https://nest-ionic-examples.github.io/01-simple-chat/
      https://www.digitalocean.com/community/tutorials/angular-socket-io
      https://www.thepolyglotdeveloper.com/2019/04/using-socketio-create-multiplayer-game-angular-nodejs/
      https://docs.nestjs.com/websockets/gateways
      https://socket.io/docs/v4/typescript/
*/