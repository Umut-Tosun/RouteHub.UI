import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';
import { Stop, CreateStopRequest, UpdateStopRequest } from '../../models/stop.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StopService {

  constructor(private apiService: ApiService) {}

  // Tüm durakları getir
  getAll(): Observable<ApiResponse<Stop[]>> {
    return this.apiService.get<ApiResponse<Stop[]>>('/stops');
  }

  // ID'ye göre durak getir
  getById(id: string): Observable<ApiResponse<Stop>> {
    return this.apiService.get<ApiResponse<Stop>>(`/stops/${id}`);
  }

  // Rotaya göre durakları getir (sıralı)
  getByRoute(routeId: string): Observable<ApiResponse<Stop[]>> {
    return this.apiService.get<ApiResponse<Stop[]>>(`/stops/route/${routeId}`);
  }

  // Yeni durak oluştur (AUTH gerekli)
  create(data: CreateStopRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/stops', data);
  }

  // Durak güncelle (AUTH gerekli)
  update(data: UpdateStopRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<ApiResponse<any>>('/stops', data);
  }

  // Durak sil (AUTH gerekli)
  delete(id: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`/stops/${id}`);
  }
}