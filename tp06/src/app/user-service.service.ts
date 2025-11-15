import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User } from './models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor( private http: HttpClient ) { }

  getUsers() {
    return this.http.get<User[]>(environment.apiUrl + "/utilisateur");
  }

  addUser(user: User) {
    return this.http.post<User>(environment.apiUrl + "/utilisateur", user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(environment.apiUrl + "/utilisateur/" + id);
  }

  login(login: string, pass: string) {
    return this.http.post<any>(environment.apiUrl + "/utilisateur/login", { login, pass }).pipe(
      tap(() => {
        this.isLoggedInSubject.next(true);
      })
    );
  }

  logout() {
    this.isLoggedInSubject.next(false);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}
