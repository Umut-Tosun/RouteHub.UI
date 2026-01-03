import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Token
  setToken(token: string): void {
    localStorage.setItem('routehub_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('routehub_token');
  }

  removeToken(): void {
    localStorage.removeItem('routehub_token');
  }

  // User
  setUser(user: any): void {
    localStorage.setItem('routehub_user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('routehub_user');
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem('routehub_user');
  }

  // Theme
  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('routehub_theme', theme);
  }

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem('routehub_theme') as 'light' | 'dark') || 'light';
  }

  // Clear all
  clearAll(): void {
    localStorage.removeItem('routehub_token');
    localStorage.removeItem('routehub_user');
  }
}