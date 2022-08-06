import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  ImageUrl: string | undefined = ""
  Username: string | undefined = ""

  constructor() { }

  GetImageUrl(): string | undefined {
    return this.ImageUrl;
  }

  GetUsername(): string | undefined {
    return this.Username;
  }

  SetImageUrl(url: string | undefined) {
    this.ImageUrl = url;
  }

  SetUsername(username: string | undefined) {
    console.log("SET user :" + username)
    this.Username = username;
  }
}
