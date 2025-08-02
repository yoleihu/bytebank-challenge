import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthService } from '@core/interfaces/auth.interface';
import { User } from '@core/models/user';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'authToken';
  private userIdKey = 'userId';

  public login(credentials: Pick<User, 'email' | 'password'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/auth`, credentials).pipe(
      tap(response => {
        if (response && response.result) {
          if (response.result.token) {
            localStorage.setItem(this.tokenKey, response.result.token);
          }
          if (response.result.id) {
            localStorage.setItem(this.userIdKey, response.result.id);
          }
        }
      })
    );
  }

  /*
  public setAccountId() {
    return this.http.get<any>(`${this.apiUrl}/account`).pipe(
      tap((response) => {
        if (response &&  response.result.account) {
          localStorage.setItem(this.accountId, response.result.account[0].id);
        }
      })
    );
  }
    */

  public getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  signUp(userData: Partial<User>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, userData);
  }

  getTokenPayload(): User & {exp: number} | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = atob(token);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private _generateJwt(user: User): void {
    const payload: User & {exp: number} = {
      id: user.id,
      email: user.email,
      username: user.username,
      exp: Date.now() + 10 * 60 * 1000 // 10 minutos
    };
    localStorage.setItem('token', btoa(JSON.stringify(payload)));
  }
}
