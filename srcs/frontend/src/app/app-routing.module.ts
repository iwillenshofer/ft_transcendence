import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginpageComponent } from './components/login/loginpage/loginpage.component';
import { LoginCallbackComponent } from './components/login/callback/callback.component';

const routes: Routes = [{
	path: '',
	redirectTo: 'login',
	pathMatch: 'full'
},
{
	path: 'login',
	component: LoginpageComponent, 
},
{
	path: 'login/callback',
	component: LoginCallbackComponent, 
},
{
	path: 'home',
	component: HomeComponent, 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
