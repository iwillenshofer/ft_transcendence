import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
  }

  public ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    console.log('aqui');
    this.socket.on("position", (position: { x: any; y: any; }) => {
      console.log('aqui2', position)
      this.context.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.context.fillRect(position.x, position.y, 20, 20);
    });
  }

  public move(direction: string) {
    this.socket.emit("move", direction);
  }

}