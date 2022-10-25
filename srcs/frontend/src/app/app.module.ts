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
import { ChatModule } from './chat/chat.module';
import { NavbarComponent } from './components/navigation/navbar/navbar.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/friends/friends.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DialogAvatarComponent } from './components/dialogs/dialog-avatar/dialog-avatar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogUsernameComponent } from './components/dialogs/dialog-username/dialog-username.component';
import { MatInputModule } from '@angular/material/input';
import { ProfileComponent } from './components/profile/profile.component';
import { OnlineGameComponent } from './components/game/online-game/online-game.component';
import { AlertsModule } from './alerts/alerts.module';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { DialogNewRoomComponent } from './components/dialogs/dialog-new-room/dialog-new-room.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatToolbarModule } from '@angular/material/toolbar';

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
    DialogAvatarComponent,
    DialogUsernameComponent,
    ProfileComponent,
    CreateRoomComponent,
    OnlineGameComponent,
    DialogNewRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AuthModule.forRoot(),
    ChatModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    AlertsModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule
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
