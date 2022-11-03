import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatService } from 'src/app/chat/chat.service';
import { RoomInterface, RoomPaginateInterface } from 'src/app/model/room.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogNewRoomComponent } from '../dialogs/dialog-new-room/dialog-new-room.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  rooms$: Observable<RoomPaginateInterface> = this.chatService.getMyRooms();
  publicRooms$: Observable<RoomPaginateInterface> = this.chatService.getPublicRooms();

  selectedRoom = null;
  selectedPublicRoom = null;
  Isrooms: boolean = false;

  constructor(
    private chatService: ChatService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
    this.chatService.emitPaginatePublicRooms(10, 0);
    this.rooms$ = this.chatService.getMyRooms();
    this.publicRooms$ = this.chatService.getPublicRooms();

    //this.Isrooms = this.rooms$.subscribe.length > 0;
  }

  ngAfterViewInit(): void {
    this.chatService.emitPaginateRooms(10, 0);
    this.chatService.emitPaginatePublicRooms(10, 0);
    this.rooms$ = this.chatService.getMyRooms();
    this.publicRooms$ = this.chatService.getPublicRooms();
    //this.Isrooms = this.rooms$.subscribe.length > 0;
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onSelectPublicRoom(event: MatSelectionListChange) {
    this.selectedPublicRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
    if (pageEvent.pageSize != 10)
      pageEvent.pageSize = 10;
  }

  onPaginatePublicRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginatePublicRooms(pageEvent.pageSize, pageEvent.pageIndex);
    if (pageEvent.pageSize != 10)
      pageEvent.pageSize = 10;
  }

  openDialogNewRoom() {
    const dialogRef = this.dialog.open(DialogNewRoomComponent, {
      data: { title: 'Change your profile picture' }
    });

    dialogRef.afterClosed().subscribe(
      () => this.chatService.emitPaginateRooms(10, 0)
    );

    dialogRef.afterClosed().subscribe(
      () => this.chatService.emitPaginatePublicRooms(10, 0)
    );
  }

  onJoinRoom(selectedPublicRoom: RoomInterface | null) {
    if (selectedPublicRoom != null)
      this.chatService.joinRoom(selectedPublicRoom);
  }


}
