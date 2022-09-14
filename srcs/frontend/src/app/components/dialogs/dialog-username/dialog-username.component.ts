
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { UserService } from 'src/app/services/user.service';
import { isUsernameTaken } from 'src/app/validators/async-username.validator';

@Component({
  selector: 'app-dialog-username',
  templateUrl: './dialog-username.component.html',
  styleUrls: ['./dialog-username.component.scss']
})
export class DialogUsernameComponent implements OnInit {

  form = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern('^[a-z0-9]+$'),
    forbiddenNameValidator(this.userService.Username),
    forbiddenNameValidator('admin')
  ], [isUsernameTaken(this.userService)]);

  constructor(private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  // OnClick of button Upload
  updateName(user: string | null) {
    this.userService.updateUsername(user).subscribe(
      (event: any) => {
        if (event.username != '') {
          this.userService.Username = event.username;
        }
      }
    )
  }
}
