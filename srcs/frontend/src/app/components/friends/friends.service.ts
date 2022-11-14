import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
    private http: HttpClient,
    private alertService: AlertsService
  ) {
    this.selectedUser = new BehaviorSubject<string | undefined | null>(null);
    this.gamesPlayed = new BehaviorSubject<number>(0);
    this.gamesWon = new BehaviorSubject<number>(0);
    this.userInfo = new BehaviorSubject<any | null>(null);
    this.userList = new BehaviorSubject<any[]>([]);
    this.friendsList = new BehaviorSubject<any[]>([]);
    this.requestsList = new BehaviorSubject<any[]>([]);
    this.friendStatus = new BehaviorSubject<number>(0);
  }
  public selectedUser: BehaviorSubject<string | undefined | null>;
  public history: any[] = [];
  public gamesPlayed: BehaviorSubject<number>;
  public gamesWon: BehaviorSubject<number>;
  public friendStatus: BehaviorSubject<number>;
  public userInfo: BehaviorSubject<any | null>;
  public userList: BehaviorSubject<any[]>;
  public friendsList: BehaviorSubject<any[]>;
  public requestsList: BehaviorSubject<any[]>;

  ngOnInit(): void { }

  loadUser(username: string) {
    this.selectedUser.next(username);
  }


  getHistory(): Observable<any> {
    return this.http.get('/backend/stats/history/' + this.selectedUser.value, { withCredentials: true });
  }

  getUserInfo(): Observable<any> {
    return this.http.get('/backend/stats/userinfo/' + this.selectedUser.value, { withCredentials: true });
  }

  getUserList(filter: string): Observable<any> {
    return this.http.get('/backend/friends/searchusers/' + filter, { withCredentials: true });
  }

  getRequestsList(): Observable<any> {
    return this.http.get('/backend/friends/getrequests/', { withCredentials: true });
  }

  getFriendsList(): Observable<any> {
    return this.http.get('/backend/friends/getfriends/', { withCredentials: true });
  }

  getFriendshipStatus(username: any): Observable<any> {
    return this.http.get('/backend/friends/friendshipstatus/' + username, { withCredentials: true });
  }

  requestFriendship(username: string): Observable<any> {
    return this.http.post('/backend/friends/requestfriendship/' + username, { withCredentials: true });
  }

  cancelFriendship(username: string): Observable<any> {
    return this.http.post('/backend/friends/removefriendship/' + username, { withCredentials: true });
  }

  confirmFriendship(username: string): Observable<any> {
    return this.http.post('/backend/friends/acceptfriendship/' + username, { withCredentials: true });
  }

  async acceptFriendship(username: string = '') {
    if (username == '') { username = this.selectedUser.value || '' };
    this.confirmFriendship(username).subscribe((res) => {
      // console.log(res);
      if ((res.status == 3)) { this.alertService.success(res.message); }
      else { this.alertService.warning("friendship could not be accepted"); }
      this.update();
    });
  }

  async addFriendship() {
    this.requestFriendship(this.selectedUser.value || '').subscribe((res) => {
      // console.log(res);
      if ((res.status == 4)) { this.alertService.success(res.message); }
      else { this.alertService.warning(res.message); }
      this.update();
    });
  }

  async delFriendship(username: string = '') {
    if (username == '') { username = this.selectedUser.value || '' };
    this.cancelFriendship(username).subscribe((res) => {
      // console.log(res);
      if ((res.status == 0)) { this.alertService.success(res.message); }
      else { this.alertService.warning('friendship could not be cancelled'); }
      this.update();
    });
  }

  async update() {
    await this.updateHistory();
    await this.updateUserInfo();
    await this.updateFriendshipStatus();
    await this.updateFriendsList();
    await this.updateRequestsList();
  }

  async updateFriendshipStatus() {
    this.getFriendshipStatus(this.selectedUser.value).subscribe((res: any) => {
      this.friendStatus.next(res.status);
    })
  }

  async updateUserInfo() {
    // console.log("Selected User: " + this.selectedUser.value);
    await this.getUserInfo().subscribe((res: any) => {
      this.userInfo.next(res);
    })
  }

  async filterUserList(filter: string) {
    if (filter.length < 3) {
      this.userList.next([]);
      return;
    }
    this.getUserList(filter).subscribe((res: any[]) => {
      this.userList.next(res);
    })
  }

  async updateFriendsList() {
    this.getFriendsList().subscribe((res: any[]) => {
      this.friendsList.next(res);
    })
  }

  async updateRequestsList() {
    this.getRequestsList().subscribe((res: any[]) => {
      this.requestsList.next(res);
    })
  }

  async updateHistory() {
    this.getHistory().subscribe((res: any[]) => {
      this.history = res;
      let gamesPlayed = 0;
      let gamesWon = 0;
      for (var h of this.history) {
        gamesPlayed++;
        if ((h.user1.username == this.selectedUser.value && h.scoreP1 > h.scoreP2) ||
          (h.user2.username == this.selectedUser.value && h.scoreP2 > h.scoreP1)) { gamesWon++; };
        this.gamesPlayed.next(gamesPlayed);
        this.gamesWon.next(gamesWon);
      };
    });
  }
}
