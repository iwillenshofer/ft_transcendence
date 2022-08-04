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
import { TwofactorComponent } from './components/login/twofactor/twofactor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthguardService } from './auth/guards/authguard.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ChatModule } from './chat/chat.module';
import { NavbarComponent } from './components/navigation/navbar/navbar.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/friends/friends.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationComponent } from './components/navigation/navigation.component';
import { BallComponent } from './components/game/ball/ball.component';
import { PaddleComponent } from './components/game/paddle/paddle.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    LoginCallbackComponent,
    ButtonComponent,
    HomeComponent,
    TwofactorComponent,
    NavigationComponent,
    NavbarComponent,
    SidebarComponent,
    GameComponent,
    ChatComponent,
    FriendsComponent,
    BallComponent,
    PaddleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule.forRoot(),
    ChatModule,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthguardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
