import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  ImageUrl: string | undefined = ""
  Username: string = ""

  constructor() { }

  GetImageUrl(): string | undefined {
    return this.ImageUrl;
  }

  SetImageUrl(url: string | undefined) {
    console.log("SetImage : " + url)
    this.ImageUrl = url;
  }
}
