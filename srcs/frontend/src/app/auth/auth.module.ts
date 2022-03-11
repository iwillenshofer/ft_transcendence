import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders<AuthModule> {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService
			]
		}
	}
}
