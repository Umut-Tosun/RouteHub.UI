import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './stroge.service';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean>(false);
  currentUser = signal<any>(null);

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private checkAuth(): void {
    const token = this.storageService.getToken();
    const user = this.storageService.getUser();
    
    if (token && user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.apiService.post<ApiResponse<LoginResponse>>('/users/login', credentials)
      .pipe(
        tap(response => {
          if (response.isSuccess && response.data) {
            this.storageService.setToken(response.data.token);
            this.storageService.setUser(response.data.user);
            this.isAuthenticated.set(true);
            this.currentUser.set(response.data.user);
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/users/register', data);
  }

  logout(): void {
    this.storageService.clearAll();
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }
}