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

const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, canActivate: [AuthguardService] },
	{ path: 'login', component: LoginpageComponent },
	{ path: 'login/callback', component: LoginCallbackComponent },
	{ path: 'enable2fa', component: TwofactorComponent, canActivate: [AuthguardService] },
	{ path: 'pong', component: GameComponent },
	{ path: 'chat', component: ChatComponent },
	{ path: 'friends', component: FriendsComponent },
	{ path: 'profile', component: ProfileComponent },


];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})


export class AppRoutingModule { }
