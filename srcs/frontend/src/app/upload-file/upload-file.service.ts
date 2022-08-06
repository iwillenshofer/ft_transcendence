import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  // API url
  baseApiUrl = "/backend/users/upload"

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  // Returns an observable
  upload(file: any): Observable<any> {

    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    const filename = this.authService.getUserFromLocalStorage()?.id + '.' + file.name.split('.').pop();
    formData.append("file", file, filename);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl, formData, { withCredentials: true })
  }
}