import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Route as RouteModel } from '../../models/route.model';
import { Category } from '../../models/category.model';
import { RouteService } from '../../core/services/route';
import { CategoryService } from '../../core/services/category';
import { RouteCard } from '../../shared/components/route-card/route-card';
import { Footer } from '../../shared/components/footer/footer';
import { CategoryPill } from '../category-pill/category-pill';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteCard, CategoryPill],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private routeService = inject(RouteService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  featuredRoutes = signal<RouteModel[]>([]);
  popularRoutes = signal<RouteModel[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.categories.set(response.data);
        }
      },
      error: (error) => console.error('Kategoriler yüklenemedi:', error)
    });

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
      this.router.navigate(['/routes'], { queryParams: { search: query.trim() } });
    }
  }

  updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onRouteCardClick(route: RouteModel): void {
    this.router.navigate(['/routes', route.routeLink]);
  }

  onCategoryClick(category: Category): void {
    this.router.navigate(['/categories'], { queryParams: { category: category.id } });
  }
}