import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  footerLinks = [
    { label: 'Hakkımızda', route: '/about' },
    { label: 'Gizlilik', route: '/privacy' },
    { label: 'Şartlar', route: '/terms' },
    { label: 'İletişim', route: '/contact' }
  ];
}