import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ImageUrl: string = ""
  Username: string = ""

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  uploadProfilePicture(file: any): Observable<any> {
    const formData = new FormData();
    const filename = this.authService.getUserFromLocalStorage()?.id + '.' + file.name.split('.').pop();
    formData.append("file", file, filename);
    return this.http.post("/backend/user/upload", formData, { withCredentials: true })
  }

  getImageFromServer(): Observable<any> {
    return this.http.get('/backend/user/image-url/', { withCredentials: true });
  }

  getUsernameFromServer(): Observable<any> {
    return this.http.get('/backend/user/username/', { withCredentials: true });
  }

  updateUsername(username: any): Observable<any> {
    return this.http.post("/backend/user/username/", { username: username }, { withCredentials: true })
  }

  checkUsernameNotTaken(username: string) {
    return this.http.get('/backend/user/is-username-taken/' + username);
  }
}
