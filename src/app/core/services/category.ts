import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/api-response.model';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../models/category.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) {}

  // Tüm kategorileri getir
  getAll(): Observable<ApiResponse<Category[]>> {
    return this.apiService.get<ApiResponse<Category[]>>('/categories');
  }

  // ID'ye göre kategori getir
  getById(id: string): Observable<ApiResponse<Category>> {
    return this.apiService.get<ApiResponse<Category>>(`/categories/${id}`);
  }

  // Slug'a göre kategori getir
  getBySlug(slug: string): Observable<ApiResponse<Category>> {
    return this.apiService.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
  }

  // Yeni kategori oluştur (AUTH gerekli)
  create(data: CreateCategoryRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/categories', data);
  }

  // Kategori güncelle (AUTH gerekli)
  update(data: UpdateCategoryRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<ApiResponse<any>>('/categories', data);
  }

  // Kategori sil (AUTH gerekli)
  delete(id: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`/categories/${id}`);
  }
}