import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService 
  ) { }

  canActivate() {
    if (!(this.authService.isAuthenticated()))
    {
      console.log('redirecting');
      this.router.navigate(['/login']);
      return false;
    }
    console.log('ok');
    return true;
  }
}
