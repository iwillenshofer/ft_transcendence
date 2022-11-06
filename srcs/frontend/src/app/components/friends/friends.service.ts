import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
    private http: HttpClient,
    ) { 
     this.selectedUser = new BehaviorSubject<string | undefined | null>(null);
     this.gamesPlayed = new BehaviorSubject<number>(0);
     this.gamesWon = new BehaviorSubject<number>(0);
     this.userInfo = new BehaviorSubject<any | null>(null);

    }
    public selectedUser: BehaviorSubject<string | undefined | null>;
    public history: any[] = [];
    public gamesPlayed: BehaviorSubject<number>;
    public gamesWon: BehaviorSubject<number>;
    public userInfo: BehaviorSubject<any | null>

    ngOnInit(): void {
      console.log("hello");
    }

  getHistory(): Observable<any> {
    return this.http.get('/backend/stats/history/' + this.selectedUser.value, { withCredentials: true });
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/backend/stats/userinfo/' + this.selectedUser.value, { withCredentials: true });
  }

  async update() {
    await this.updateHistory();
    await this.updateUserInfo();
  }

  async updateUserInfo() {
    this.getUserInfo().subscribe((res: any[] ) => {
      this.userInfo.next(res);
    })
  }


  async updateHistory() {
    this.getHistory().subscribe((res: any[] )=> {
      this.history = res;
      let gamesPlayed = 0;
      let gamesWon = 0;
      for (var h of this.history) {
        gamesPlayed++;
        if ((h.user1.username == this.selectedUser.value && h.scoreP1 > h.scoreP2) ||
        (h.user2.username == this.selectedUser.value && h.scoreP2 > h.scoreP1))
        { gamesWon++; };
        this.gamesPlayed.next(gamesPlayed);
        this.gamesWon.next(gamesWon);
      };
    });
  }
}
