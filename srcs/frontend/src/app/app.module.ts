import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './components/login/loginpage/loginpage.component';
import { LoginCallbackComponent } from './components/login/callback/callback.component';
import { ButtonComponent } from './components/button/button.component';
import { AuthModule } from './auth/auth.module';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    LoginCallbackComponent,
    ButtonComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	AuthModule.forRoot()
  ],
  providers: [{
	  provide: HTTP_INTERCEPTORS,
	  useClass: AuthInterceptor,
	  multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
