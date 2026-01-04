import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../core/services/category';
import { RouteService } from '../../core/services/route';
import { Category } from '../../models/category.model';
import { Route as RouteModel } from '../../models/route.model';
import { RouteCard } from '../../shared/components/route-card/route-card';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteCard],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.css'
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private routeService = inject(RouteService);
  private router = inject(Router);

  category = signal<Category | null>(null);
  routes = signal<RouteModel[]>([]);
  isLoading = signal<boolean>(true);
  notFound = signal<boolean>(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadCategory(slug);
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadCategoryById(id);
      }
    }
  }

  loadCategory(slug: string): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.categoryService.getBySlug(slug).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.category.set(response.data);
          this.loadRoutes(response.data.id);
        } else {
          this.notFound.set(true);
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadCategoryById(id: string): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.categoryService.getById(id).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.category.set(response.data);
          this.loadRoutes(response.data.id);
        } else {
          this.notFound.set(true);
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadRoutes(categoryId: string): void {
    this.routeService.getByCategory(categoryId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.routes.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onRouteCardClick(route: RouteModel): void {
    this.router.navigate(['/routes', route.routeLink]);
  }
}

