import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category';
import { RouteService } from '../../core/services/route';
import { Category } from '../../models/category.model';
import { Route as RouteModel } from '../../models/route.model';
import { RouteCard } from '../../shared/components/route-card/route-card';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteCard],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private routeService = inject(RouteService);
  private activatedRoute = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);
  routes = signal<RouteModel[]>([]);
  isLoading = signal<boolean>(true);
  isLoadingRoutes = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.categories.set(response.data);
          
          // URL'den category parametresini al ve seç
          const categoryId = this.activatedRoute.snapshot.queryParams['category'];
          if (categoryId) {
            const category = response.data.find(c => c.id === categoryId);
            if (category) {
              this.onCategoryClick(category);
            } else {
              // URL'de kategori yoksa ilk kategoriyi seç
              if (response.data.length > 0) {
                this.onCategoryClick(response.data[0]);
              }
            }
          } else {
            // URL'de kategori parametresi yoksa ilk kategoriyi seç
            if (response.data.length > 0) {
              this.onCategoryClick(response.data[0]);
            }
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onCategoryClick(category: Category): void {
    if (this.selectedCategory()?.id === category.id) {
      // Aynı kategoriye tıklanırsa seçimi kaldır
      this.selectedCategory.set(null);
      this.routes.set([]);
    } else {
      this.selectedCategory.set(category);
      this.loadRoutesForCategory(category.id);
    }
  }

  loadRoutesForCategory(categoryId: string): void {
    this.isLoadingRoutes.set(true);
    this.routeService.getByCategory(categoryId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.routes.set(response.data);
        }
        this.isLoadingRoutes.set(false);
      },
      error: () => {
        this.isLoadingRoutes.set(false);
      }
    });
  }

  onRouteCardClick(route: RouteModel): void {
    // Route card'ın kendi routerLink'i var, buraya gerek yok
  }
}

