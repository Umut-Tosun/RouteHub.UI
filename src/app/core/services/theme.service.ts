import { Injectable, signal } from '@angular/core';
import { StorageService } from './stroge.service';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  isDarkMode = signal<boolean>(false);

  constructor(private storageService: StorageService) {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = this.storageService.getTheme();
    this.isDarkMode.set(savedTheme === 'dark');
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
    this.applyTheme();
  }

  private applyTheme(): void {
    const theme = this.isDarkMode() ? 'dark' : 'light';
    
  
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    
    this.storageService.setTheme(theme);
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.isDarkMode.set(theme === 'dark');
    this.applyTheme();
  }
}