import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';


@Component({
  selector: 'app-category-pill',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-pill.html',
  styleUrl: './category-pill.css',
})
export class CategoryPill {
  category = input.required<Category>();
  variant = input<'default' | 'hero'>('default');

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
}