import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Route } from '../../../models/route.model';

@Component({
  selector: 'app-route-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './route-card.html',
  styleUrl: './route-card.css',
})
export class RouteCard {
  route = input.required<Route>();
  variant = input<'vertical' | 'horizontal'>('vertical');
  
  cardClick = output<Route>();

  onCardClick(): void {
    this.cardClick.emit(this.route());
  }

  getDefaultThumbnail(): string {
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop';
  }

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Tarih': '🏛️',
      'Doğa': '🌳',
      'Bisiklet': '🚴',
      'Yürüyüş': '🚶',
      'Kamp': '⛺',
      'Trekking': '🥾',
      'Kültür': '🎭',
      'Gastronomi': '🍽️'
    };
    return icons[categoryName] || '📍';
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Az önce';
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}