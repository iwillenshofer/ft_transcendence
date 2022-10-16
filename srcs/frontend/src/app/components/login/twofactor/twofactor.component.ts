import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlDirective, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

class ResponseMessage {
  msg: boolean = false;
}

class ResponseMessage2 {
	msg: string = "";
  }

@Component({
  selector: 'app-twofactor',
  templateUrl: './twofactor.component.html',
  styleUrls: ['./twofactor.component.scss']
})
export class TwofactorComponent {

  constructor(
    private http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
	private alertservice: AlertsService
  ) {
    this.keyCode = new BehaviorSubject<SafeUrl | null>("");
    this.qrCode = new BehaviorSubject<SafeUrl | null>(null);
    this.tfa_fulfilled = new BehaviorSubject<boolean>(false);
  }

  keyCode: BehaviorSubject<SafeUrl | null>;
  qrCode: BehaviorSubject<SafeUrl | null>;
  codeControl = new FormControl();
  tfa_fulfilled: BehaviorSubject<boolean>;

  ngOnInit(): void {
    this.tfa_fulfilled.next(this.authService.isAuthenticated());
    if (this.router.url == '/enable2fa')
	{
		this.getQRCode();
	}
    console.log("KEY:" + this.keyCode.value);
  }

  async submitCode() {
    this.http.post<ResponseMessage>('/backend/auth/tfa_verify', { code: this.codeControl.value }, { withCredentials: true }).subscribe((result) => {
      let res: any = result;
      if (res?.msg == true) {
        localStorage.removeItem('token');
        localStorage.setItem('token', res.token);
        this.http.get<User>('/backend/auth/profile', { withCredentials: true }).subscribe(result => {
          this.authService.userSubject.next(result);
          localStorage.setItem('user', JSON.stringify(result));
		  this.alertservice.success('Code successfuly validated');
          this.router.navigate(['/']);
        });
      } else {
		this.alertservice.warning('Invalid Code');
	  }
    });
  }

  getQRCode() {
    this.http.get<any>('/backend/auth/tfa_retrieve', { withCredentials: true }).subscribe((result) => {
		console.log("code" + JSON.stringify(result));
	  this.keyCode.next(result.key_code);
      this.qrCode.next(result.qr_code);
	});
  }
}
