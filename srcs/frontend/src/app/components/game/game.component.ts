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

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.socket.emit("move", "up");
        break;

      case 's':
      case 'S':
      case 'ArrowDown':
        this.socket.emit("move", "down");
        break;

      default:
        break;
    }
  }

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
    this.socket.emit("joinGame");
  }

  public ngAfterViewInit() {
    this.fillCanvas();
  }

  fillCanvas() {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.context.fillRect(50, 200, 5, 100);
    this.context.fillRect(500, 200, 5, 100);
    // this.context.style.background-color: preserveWhitespacesDefault;
    this.socket.on("position", (positionP1: { x: any; y: any }, positionP2: { x: any, y: any }) => {
      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(positionP1.x, positionP1.y, 5, 100);
      this.context.fillRect(positionP2.x, positionP2.y, 5, 100);
    });
  }
}