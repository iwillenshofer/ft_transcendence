import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlDirective, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

class ResponseMessage {
  msg: boolean = false;
}

@Component({
  selector: 'app-twofactor',
  templateUrl: './twofactor.component.html',
  styleUrls: ['./twofactor.component.css']
})
export class TwofactorComponent {

  constructor(
      private http: HttpClient,
      private readonly sanitizer: DomSanitizer,
      private authService: AuthService,
      private router: Router,
    ) {
      this.qrCode = new BehaviorSubject<SafeUrl | null>(null);
    }
  
  qrCode: BehaviorSubject<SafeUrl | null>;
  codeControl = new FormControl();
  ngOnInit(): void {
		this.getCode();
	  }

	async submitCode() {
		this.http.post<ResponseMessage>('/backend/auth/tfa_verify', { code: this.codeControl.value }, { withCredentials: true }).subscribe((result) => {
			let res = result;
      console.log(res);
      if (res.msg)
      {
        this.http.get<User>('/backend/auth/profile', { withCredentials: true }).subscribe(result => {
          this.authService.userSubject.next(result);
          localStorage.setItem('user', JSON.stringify(result));
          console.log(result);
          this.router.navigate(['/']);
          });
        }
	  	});
  }

  async getCode() {
    this.http.get<Blob>('/backend/auth/tfa_qrcode', { withCredentials: true, responseType: 'blob' as 'json'}).subscribe((result) => {
      this.qrCode.next(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(result)));
    });
  }
}
