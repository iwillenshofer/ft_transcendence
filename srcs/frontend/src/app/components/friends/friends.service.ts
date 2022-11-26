import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { StatsDTO } from './stats.dto';

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
    this.achievements = new BehaviorSubject<any[]>([]);
	this.stats = new BehaviorSubject<StatsDTO | null>(null);
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
  public achievements: BehaviorSubject<any[]>;
  public stats: BehaviorSubject<StatsDTO | null>;

  ngOnInit(): void { }

  loadUser(username: string) {
    this.selectedUser.next(username);
  }

  getUserStats(): Observable<StatsDTO> {
    return this.http.get<StatsDTO>('/backend/stats/' + this.selectedUser.value, { withCredentials: true });
  }

  getHistory(): Observable<any> {
    return this.http.get('/backend/stats/history/' + this.selectedUser.value, { withCredentials: true });
  }

  getAchievements(): Observable<any> {
    return this.http.get('/backend/stats/achievements/' + this.selectedUser.value, { withCredentials: true });
  }
  getUserInfo(): Observable<any> {
    return this.http.get('/backend/stats/userinfo/' + this.selectedUser.value, { withCredentials: true });
  }

  getStatus(username: string): Observable<any> {
    let x = this.http.get('/backend/stats/status/' + username, { withCredentials: true });
    return x;
  }

  setStatus(username: string, status: string) {
    let body = { status: status }
    this.http.put('/backend/stats/status/' + username, body, { withCredentials: true }).subscribe(res => { })
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
//    await this.updateHistory();
//    await this.updateUserInfo();
    await this.updateFriendshipStatus();
    await this.updateFriendsList();
    await this.updateRequestsList();
//    await this.updateAchievements();
	await this.updateUserStats();
  }


  async updateUserStats() {
    this.getUserStats().subscribe((res: StatsDTO) => {
      this.stats.next(res);
	  console.log(JSON.stringify(this.stats.value));
    })
  }

  async updateFriendshipStatus() {
    this.getFriendshipStatus(this.selectedUser.value).subscribe((res: any) => {
      this.friendStatus.next(res.status);
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
  
}
