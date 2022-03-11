import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './components/login/loginpage/loginpage.component';
import { LoginpopupComponent } from './components/login/loginpopup/loginpopup.component';

const routes: Routes = [{
	path: '',
	component: AppComponent
},
{
	path: 'home',
	component: LoginpageComponent, 
},
{
	path: 'login',
	component: LoginpopupComponent, 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
