import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/api-response.model';
import { Route, RouteDetailDto, CreateRouteRequest, UpdateRouteRequest } from '../../models/route.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private apiService: ApiService) {}

  // Tüm rotaları getir
  getAll(): Observable<ApiResponse<Route[]>> {
    return this.apiService.get<ApiResponse<Route[]>>('/routes');
  }

  // ID'ye göre rota getir
  getById(id: string): Observable<ApiResponse<RouteDetailDto>> {
    return this.apiService.get<ApiResponse<RouteDetailDto>>(`/routes/${id}`);
  }

  // Link'e göre rota getir
  getByLink(link: string): Observable<ApiResponse<RouteDetailDto>> {
    return this.apiService.get<ApiResponse<RouteDetailDto>>(`/routes/link/${link}`);
  }

  // Public rotaları getir
  getPublicRoutes(): Observable<ApiResponse<Route[]>> {
    return this.apiService.get<ApiResponse<Route[]>>('/routes/public');
  }

  // Duruma göre rotaları getir
  getByStatus(status: number): Observable<ApiResponse<Route[]>> {
    return this.apiService.get<ApiResponse<Route[]>>(`/routes/status/${status}`);
  }

  // Kategoriye göre rotaları getir
  getByCategory(categoryId: string): Observable<ApiResponse<Route[]>> {
    return this.apiService.get<ApiResponse<Route[]>>(`/routes/category/${categoryId}`);
  }

  // Popüler rotaları getir
  getPopular(): Observable<ApiResponse<Route[]>> {
    return this.apiService.get<ApiResponse<Route[]>>('/routes/popular');
  }

  // Yeni rota oluştur (AUTH gerekli)
  create(data: CreateRouteRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/routes', data);
  }

  // Rota güncelle (AUTH gerekli)
  update(data: UpdateRouteRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<ApiResponse<any>>('/routes', data);
  }

  // Rota sil (AUTH gerekli)
  delete(id: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`/routes/${id}`);
  }

  // Görüntülenme sayısını artır
  incrementView(id: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`/routes/${id}/increment-view`, {});
  }

  // Rotayı yayınla (AUTH gerekli)
  publish(id: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`/routes/${id}/publish`, {});
  }

  // Rotayı arşivle (AUTH gerekli)
  archive(id: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>(`/routes/${id}/archive`, {});
  }
}