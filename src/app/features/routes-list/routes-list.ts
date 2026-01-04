import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RouteService } from '../../core/services/route';
import { CategoryService } from '../../core/services/category';
import { Route as RouteModel } from '../../models/route.model';
import { Category } from '../../models/category.model';
import { RouteCard } from '../../shared/components/route-card/route-card';

type SortOption = 'newest' | 'popular' | 'views';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [CommonModule, RouteCard],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.css'
})
export class RoutesListComponent implements OnInit {
  private routeService = inject(RouteService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  allRoutes = signal<RouteModel[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  selectedCategoryId = signal<string | null>(null);
  sortOption = signal<SortOption>('newest');

  filteredRoutes = computed(() => {
    let routes = [...this.allRoutes()];

    // Kategori filtresi
    if (this.selectedCategoryId()) {
      routes = routes.filter(route => 
        route.categories?.some(cat => cat.id === this.selectedCategoryId())
      );
    }

    // Arama filtresi
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      routes = routes.filter(route => 
        route.title.toLowerCase().includes(query) ||
        route.description?.toLowerCase().includes(query) ||
        route.categories?.some(cat => cat.name.toLowerCase().includes(query))
      );
    }

    // Sıralama
    switch (this.sortOption()) {
      case 'newest':
        routes.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        break;
      case 'popular':
        routes.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
        break;
      case 'views':
        routes.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    return routes;
  });

  ngOnInit(): void {
    // URL'den search parametresini al
    const searchParam = this.activatedRoute.snapshot.queryParams['search'];
    if (searchParam) {
      this.searchQuery.set(searchParam);
    }
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

    // Tüm public rotaları yükle
    this.routeService.getPublicRoutes().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.allRoutes.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Rotalar yüklenemedi:', error);
        this.isLoading.set(false);
      }
    });
  }

  onCategoryClick(categoryId: string | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  onSortChange(sort: SortOption): void {
    this.sortOption.set(sort);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onRouteCardClick(route: RouteModel): void {
    this.router.navigate(['/routes', route.routeLink]);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategoryId.set(null);
    this.sortOption.set('newest');
  }
}

