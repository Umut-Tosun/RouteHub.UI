import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../models/api-response.model';
import { Comment, CommentDetailDto, CreateCommentRequest, UpdateCommentRequest } from '../../models/comment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private apiService: ApiService) {}

  // Tüm yorumları getir
  getAll(): Observable<ApiResponse<Comment[]>> {
    return this.apiService.get<ApiResponse<Comment[]>>('/comments');
  }

  // ID'ye göre yorum getir
  getById(id: string): Observable<ApiResponse<CommentDetailDto>> {
    return this.apiService.get<ApiResponse<CommentDetailDto>>(`/comments/${id}`);
  }

  // Rotaya göre yorumları getir
  getByRoute(routeId: string): Observable<ApiResponse<CommentDetailDto[]>> {
    return this.apiService.get<ApiResponse<CommentDetailDto[]>>(`/comments/route/${routeId}`);
  }

  // Yeni yorum oluştur (AUTH gerekli)
  create(data: CreateCommentRequest): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/comments', data);
  }

  // Yorum güncelle (AUTH gerekli)
  update(data: UpdateCommentRequest): Observable<ApiResponse<any>> {
    return this.apiService.put<ApiResponse<any>>('/comments', data);
  }

  // Yorum sil (AUTH gerekli)
  delete(id: string): Observable<ApiResponse<any>> {
    return this.apiService.delete<ApiResponse<any>>(`/comments/${id}`);
  }
}