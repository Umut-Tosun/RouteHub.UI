import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  private toastr = inject(ToastrService);

  // Mobile menu toggle
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    // Direkt çıkış yap, onay isteme
    this.authService.logout();
    this.isMobileMenuOpen = false;
    // Güzel bir başarı mesajı
    setTimeout(() => {
      this.toastr.success('Güvenli bir şekilde çıkış yaptınız. Tekrar görüşmek üzere! 👋', '✅ Çıkış Başarılı', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });
    }, 100);
  }

  navigateToCreate(): void {
    // Giriş yapmadan da rota oluşturabilir
    this.router.navigate(['/routes/create']);
    this.isMobileMenuOpen = false;
  }
}