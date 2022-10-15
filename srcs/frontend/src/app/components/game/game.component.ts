import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {



  @ViewChild("game")
  private gameCanvas!: ElementRef;

  private context: any;
  private socket: any;

  paused: boolean = false;

  // @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
  //   let cont = 0;
  //   let tableRect = document.getElementById('table')!.getBoundingClientRect();
  //   let max_height = tableRect.top;
  //   let min_height = tableRect.bottom;
  //   switch (event.key) {
  //     // case 'p':
  //     // case 'P':
  //     //   if (this.play && !this.finished)
  //     //     this.pause();
  //     //   break;

  //     case 'w':
  //     case 'W':
  //     case 'ArrowUp':
  //       while (++cont < 100 && !this.paused && Number(this.player1Paddle.rect.top) > max_height) {
  //         this.player1Paddle.position -= PADDLE_SPEED;
  //       }
  //       break;

  //     case 's':
  //     case 'S':
  //     case 'ArrowDown':
  //       while (++cont < 100 && !this.paused && Number(this.player1Paddle.rect.y) < min_height - this.player1Paddle.rect.height)
  //         this.player1Paddle.position += PADDLE_SPEED;
  //       break;

  //     case 'q':
  //     case 'Q':
  //       if (this.paused || this.finished) {
  //         window.location.reload();
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  // }

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
    this.socket.emit("joinGame");
  }

  public ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.context.fillRect(10, 200, 10, 50);
    // this.context.fillRect(500, 200, 10, 50);
    this.socket.on("position", (position: { x: any; y: any }) => {
      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x, position.y, 10, 50);
      // this.context.fillRect(position.x, position.y, 10, 50);
    });
  }

  public move(direction: string) {
    this.socket.emit("move", direction);
  }

}