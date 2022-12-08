import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { UserInterface } from '../model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  avatar: string = ""
  avatarChange: Subject<string> = new Subject<string>();

  username: string = "";
  usernameChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient,
    private authService: AuthService) {
    this.usernameChange.subscribe((value) => {
      this.username = value
    });

    this.avatarChange.subscribe((value) => {
      this.avatar = value
    });
  }

  setUsername(newUsername: string) {
    this.usernameChange.next(newUsername);
  }

  setAvatar(newAvatar: string) {
    this.avatarChange.next(newAvatar);
  }

  uploadProfilePicture(file: any): Observable<any> {
    const formData = new FormData();
    const filename = "image" + '.' + file.name.split('.').pop();
    formData.append("file", file, filename);
    formData.append("oldAvatar", this.avatar);
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

  findByUsername(username: string): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`/backend/user/find-by-username?username=${username}`);
  }

  getUserById(id: number) {
    return this.http.get('/backend/user/get_user_by_id/' + id, { withCredentials: true });
  }

  getUserByUsername(username: number) {
    return firstValueFrom(this.http.get<User>('/backend/user/get_user_by_username/' + username, { withCredentials: true }));
  }

  getMyUser() {
    return this.http.get<any>('/backend/user/get_my_user/', { withCredentials: true });
  }

  getAllUsername(): Observable<any> {
    return this.http.get('/backend/user/get_all_users/', { withCredentials: true });
  }

  getAvatarOfUser(avatar: string) {
    return this.http.get('/backend/user/image/' + avatar, { withCredentials: true });
  }
}
