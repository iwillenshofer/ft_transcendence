
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenNameValidator } from './forbidden-name.directive';
import { UserService } from 'src/app/services/user.service';
import { isUsernameTaken } from 'src/app/validators/async-username.validator';

@Component({
  selector: 'app-dialog-username',
  templateUrl: './dialog-username.component.html',
  styleUrls: ['./dialog-username.component.scss']
})
export class DialogUsernameComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern('^[a-z0-9]+$'),
    forbiddenNameValidator(this.userService.username),
    forbiddenNameValidator('admin')
    ], [isUsernameTaken(this.userService)])
  });

  constructor(private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  // OnClick of button Upload
  updateName(username: string) {
    this.userService.updateUsername(username).subscribe(
      (event: any) => {
        if (event.username != '') {
          this.userService.setUsername(event.username);
        }
      }
    )
  }
}
