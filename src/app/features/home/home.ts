import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Route } from '../../models/route.model';
import { Category } from '../../models/category.model';
import { RouteService } from '../../core/services/route';
import { CategoryService } from '../../core/services/category';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private routeService = inject(RouteService);
  private categoryService = inject(CategoryService);

  // Signals
  featuredRoutes = signal<Route[]>([]);
  popularRoutes = signal<Route[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Kategorileri yükle
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.categories.set(response.data);
        }
      },
      error: (error) => console.error('Kategoriler yüklenemedi:', error)
    });

    // Public rotaları yükle
    this.routeService.getPublicRoutes().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.featuredRoutes.set(response.data.slice(0, 6));
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Rotalar yüklenemedi:', error);
        this.isLoading.set(false);
      }
    });

    // Popüler rotaları yükle
    this.routeService.getPopular().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.popularRoutes.set(response.data.slice(0, 3));
        }
      },
      error: (error) => console.error('Popüler rotalar yüklenemedi:', error)
    });
  }

  onSearch(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      // TODO: Search sayfasına yönlendir
      console.log('Arama:', query);
    }
  }

  updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}