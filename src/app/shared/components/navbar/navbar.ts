import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  // Mobile menu toggle
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }

  navigateToCreate(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/routes/create']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.isMobileMenuOpen = false;
  }
}