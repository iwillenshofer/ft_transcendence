import { UseGuards } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TfaGuard } from 'src/auth/tfa/tfa.guard';

@WebSocketGateway({ cors: '*:*' })
export class GameGateway {

  @WebSocketServer()
  server: Server;

  player1: any;
  positionP1 = {
    x: 0,
    y: 0,
  };
  scoreP1: number = 0;
  player2: any;
  positionP2 = {
    x: 0,
    y: 0,
  };
  scoreP2: number = 0;
  ball = {
    x: 0,
    y: 0,
  }
  ballDirection: { x: number; y: number } = { x: 0.0, y: 0.0 };
  velocity: number = .001;
  lastTouch: number = 0;

  @SubscribeMessage('joinGame')
  joinGame(client: Socket) {
    this.resetBall();
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
          if (position.y > 0)
            position.y -= 5;
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
        case "down":
          if (position.y < 400)
            position.y += 5;
          this.server.emit("position", this.positionP1, this.positionP2);
          break;
      }
    }
  }

  @UseGuards(TfaGuard)
  handleDisconnect(client: Socket, ...args: any[]) {
    if (client.id == this.player1) {
      this.player1 = null;
      console.log('player1 disconnected')
      this.resetPlayersPosition();
    }
    else if (client.id == this.player2) {
      this.player2 = null;
      console.log('player2 disconnected')
      this.resetPlayersPosition();
    }
  }

  setPlayers(clientId) {
    if (!this.player1) {
      this.player1 = clientId;
      console.log('player1 connected')
    }
    else if (!this.player2) {
      this.player2 = clientId;
      console.log('player2 connected')
      this.resetPlayersPosition();
    }
    else {
      console.log('spec')
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

  @SubscribeMessage('ballTime')
  updateBall(client: Socket, time: number) {
    if (this.lastTime) {
      const delta = time - this.lastTime;
      this.ballUpdate(time, [this.rectP1, this.rectP2]);
      this.server.emit("ballUpdate", this.ball);
      this.server.emit("position", this.positionP1, this.positionP2);
    }
    if (this.isLose())
      this.handleLose();
    this.lastTime = time;
  }

  ballUpdate(delta: number, paddleRects: any[]) {
    this.ball.x += this.ballDirection.x * this.velocity * delta;
    this.ball.y += this.ballDirection.y * this.velocity * delta;
    this.velocity += 0.000000005 * delta;

    const rect = this.ballRect()

    if (rect.bottom >= 500 || rect.top <= 100) {
      this.ballDirection.y *= -1;
    }

    if (this.isCollision(this.rectP1(), rect)) {
      this.lastTouch = 1;
      this.ballDirection.x *= -1;
    }

    if (this.isCollision(paddleRects[1], rect)) {
      this.lastTouch = 2;
      this.ballDirection.x *= -1;
    }
  }

  rectP1() {
    let rect = {
      bottom: this.positionP1.y + 50,
      top: this.positionP1.y - 50,
      right: this.positionP1.x + 5,
      left: this.positionP1.x - 5,
    }
    return rect;
  }

  rectP2() {
    let rect = {
      bottom: this.positionP2.y + 50,
      top: this.positionP2.y - 50,
      right: this.positionP2.x + 5,
      left: this.positionP2.x - 5,
    }
    return rect;
  }

  ballRect() {
    let rect = {
      bottom: this.ball.y + 5,
      top: this.ball.y - 5,
      right: this.ball.x + 5,
      left: this.ball.y + 5,

    }
    return rect;
  }

  isCollision(rect1, rect2) {
    return Math.ceil(rect1.left) <= Math.floor(rect2.right) && Math.ceil(rect1.right) >= Math.floor(rect2.left) && Math.ceil(rect1.top) <= Math.floor(rect2.bottom) && Math.ceil(rect1.bottom) >= Math.floor(rect2.top);
  }

  isLose() {
    const rect = this.ballRect();
    return rect.right >= 560 || rect.left <= 0;
  }

  handleLose() {
    const rect = this.ballRect();
    if (rect.right >= 560)
      this.scoreP1 += 1;
    if (rect.left <= 0)
      this.scoreP2 += 1;
    this.resetBall();
  }

  resetBall() {
    this.ball.x = 280;
    this.ball.y = 250;
    this.ballDirection.x = 200;
    this.ballDirection.y = 200;
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