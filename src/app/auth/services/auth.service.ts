import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../interfaces/Usuario';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() == 'checking') return 'checking';
    if (this._user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });


  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
  isAdmin = computed(() => this._user()?.role.includes('admin') ?? false)


  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/login`, { email, password }).pipe(
      map(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    )
  }

  registrarse(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/register`, { email, password, fullName }).pipe(
      map(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    )
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token')
    if (!token) {
      return of(false);
    }
    return this.http.get<AuthResponse>(`${baseUrl}/status`)
      .pipe(
        map(response => response.status),
        // map(response => this.handleAuthSuccess(response)),
        catchError(error => of(false))
      )
  }

  logout() {
    return this.http.get<AuthResponse>(`${baseUrl}/logout`).pipe(
      tap((resp) => {
        this._authStatus.set('not-authenticated');
        this._token.set(null);
        this._user.set(null);
        localStorage.removeItem('token');
      })
    )
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._authStatus.set('authenticated');
    this._token.set(resp.token);
    this._user.set(resp.user!);
    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
