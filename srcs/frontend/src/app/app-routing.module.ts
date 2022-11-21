import { OnlineGameComponent } from './components/game/online-game/online-game.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginpageComponent } from './components/login/loginpage/loginpage.component';
import { LoginCallbackComponent } from './components/login/callback/callback.component';
import { AuthguardService } from './auth/guards/authguard.service';
import { TwofactorComponent } from './components/login/twofactor/twofactor.component';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DoubleLoginComponent } from './components/login/double-login/double-login.component';

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, canActivate: [AuthguardService], pathMatch: 'full' },
	{ path: 'login', component: LoginpageComponent, pathMatch: 'full' },
	{ path: 'login/callback', component: LoginCallbackComponent, pathMatch: 'full' },
	{ path: 'enable2fa', component: TwofactorComponent, canActivate: [AuthguardService], pathMatch: 'full' },
	{ path: 'pong', component: GameComponent, pathMatch: 'full' },
	{ path: 'chat', component: ChatComponent, pathMatch: 'full' },
	{ path: 'friends', component: FriendsComponent, pathMatch: 'full' },
	{ path: 'profile', component: ProfileComponent, pathMatch: 'full' },
	{ path: 'doublelogin', component: DoubleLoginComponent, pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})


export class AppRoutingModule { }
