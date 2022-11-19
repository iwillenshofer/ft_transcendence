import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { debounceTime, interval, map, Observable, timeInterval, timeout, timer } from "rxjs";
import { RoomService } from "../services/room/room.service";


export function isRoomNameTaken(roomService: RoomService): AsyncValidatorFn {

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return roomService.checkRoomNameNotTaken(control.value).pipe(
            map(result => {
                if (result.valueOf() === true) {
                    return { "roomNameTaken": true };;
                }
                else {
                    return null
                }
            })
        )
    }
}

