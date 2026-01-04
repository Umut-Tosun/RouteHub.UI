import { Component, OnInit, AfterViewInit, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import * as L from 'leaflet';
import { RouteService } from '../../core/services/route';
import { AuthService } from '../../core/services/auth.service';
import { CommentService } from '../../core/services/comment';
import { RouteDetailDto } from '../../models/route.model';
import { CommentDetailDto, CreateCommentRequest, CommentBasicDto } from '../../models/comment.model';


@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './route-detail.html',
  styleUrl: './route-detail.css'
})
export class RouteDetail implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private routeService = inject(RouteService);
  private commentService = inject(CommentService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);

  routeDetail = signal<RouteDetailDto | null>(null);
  comments = signal<CommentDetailDto[]>([]);
  isLoading = signal<boolean>(true);
  isSubmittingComment = signal<boolean>(false);
  commentForm: FormGroup;
  replyingTo = signal<string | null>(null);
  replyForm: FormGroup;
  
  @ViewChild('replyTemplate') replyTemplate!: TemplateRef<any>;
  
  private map: L.Map | null = null;

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    const routeLink = this.route.snapshot.paramMap.get('routeLink');
    if (routeLink) {
      this.loadRoute(routeLink);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  loadRoute(routeLink: string): void {
    this.isLoading.set(true);
    
    this.routeService.getByLink(routeLink).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.routeDetail.set(response.data);
          this.routeService.incrementView(response.data.id).subscribe();
          this.loadComments(response.data.id);
          setTimeout(() => this.drawStops(), 300);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadComments(routeId: string): void {
    this.commentService.getByRoute(routeId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.comments.set(response.data);
        }
      },
      error: (error) => console.error('Yorumlar yüklenemedi:', error)
    });
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid || !this.routeDetail()) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    this.isSubmittingComment.set(true);
    const commentData: CreateCommentRequest = {
      routeId: this.routeDetail()!.id,
      userId: currentUser.id,
      content: this.commentForm.value.content,
      parentCommentId: undefined
    };

    console.log('Comment gönderiliyor:', commentData);

    this.commentService.create(commentData).subscribe({
      next: (response) => {
        console.log('Comment response:', response);
        // Backend BaseResult<T> yapısı kontrolü
        if (response) {
          const backendResponse = response as any;
          
          // BaseResult yapısı: IsSuccess computed property, Messages null ise başarılı
          const isSuccess = backendResponse.isSuccess === true || 
                           (backendResponse.messages === null || backendResponse.messages === undefined || 
                            (Array.isArray(backendResponse.messages) && backendResponse.messages.length === 0)) ||
                           (backendResponse.data !== undefined && backendResponse.data !== null);
          
          if (isSuccess) {
            this.commentForm.reset();
            this.loadComments(this.routeDetail()!.id);
          } else {
            console.error('Yorum gönderilemedi:', response);
            const errorMsg = response.errorMessages?.[0] || 
                           response.messages?.[0]?.message || 
                           (backendResponse.messages?.[0]?.message) ||
                           'Yorum gönderilemedi';
            this.toastr.error(errorMsg, 'Hata', {
              timeOut: 4000,
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true
            });
          }
        } else {
          console.error('Yanıt null geldi:', response);
          this.toastr.error('Yorum gönderilemedi. Lütfen tekrar deneyin.', 'Hata', {
            timeOut: 4000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
        this.isSubmittingComment.set(false);
      },
      error: (error) => {
        console.error('Yorum gönderilirken hata oluştu:', error);
        console.error('Error details:', {
          status: error?.status,
          statusText: error?.statusText,
          error: error?.error,
          message: error?.message,
          fullError: error
        });
        
        // Backend'den gelen BaseResult yapısını kontrol et
        const backendError = error?.error;
        let errorMsg = 'Yorum gönderilirken bir hata oluştu';
        
        if (backendError) {
          // BaseResult yapısından hata mesajını al
          if (backendError.messages && Array.isArray(backendError.messages) && backendError.messages.length > 0) {
            errorMsg = backendError.messages[0].message || backendError.messages[0].Message || errorMsg;
          } else if (backendError.errorMessages && Array.isArray(backendError.errorMessages) && backendError.errorMessages.length > 0) {
            errorMsg = backendError.errorMessages[0];
          } else if (backendError.message) {
            errorMsg = backendError.message;
          } else if (error?.message) {
            errorMsg = error.message;
          }
        }
        
        this.toastr.error(errorMsg, 'Hata', {
          timeOut: 4000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true
        });
        this.isSubmittingComment.set(false);
      }
    });
  }

  onReply(commentId: string): void {
    this.replyingTo.set(commentId);
    this.replyForm.reset();
  }

  onSubmitReply(): void {
    if (this.replyForm.invalid || !this.routeDetail() || !this.replyingTo()) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    this.isSubmittingComment.set(true);
    
    // replyingTo() direkt olarak yanıt verilen yorumun/reply'nin ID'si
    // Backend artık direkt bu ID'yi parentCommentId olarak kullanıyor
    // GetCommentsByRouteIdQueryHandler recursive olarak ağaç yapısını oluşturuyor
    const replyingToId = this.replyingTo()!;
    
    const replyData: CreateCommentRequest = {
      routeId: this.routeDetail()!.id,
      userId: currentUser.id,
      content: this.replyForm.value.content,
      parentCommentId: replyingToId // Direkt yanıt verilen yorumun/reply'nin ID'sini gönder
    };

    console.log('Reply gönderiliyor:', replyData);

    this.commentService.create(replyData).subscribe({
      next: (response) => {
        console.log('Reply response:', response);
        // Backend BaseResult<T> yapısı kontrolü
        // BaseResult'ta IsSuccess property'si computed - Messages null veya boşsa true
        if (response) {
          // Backend'den gelen response yapısını kontrol et
          const backendResponse = response as any;
          
          // BaseResult yapısı: IsSuccess computed property, Messages null ise başarılı
          const isSuccess = backendResponse.isSuccess === true || 
                           (backendResponse.messages === null || backendResponse.messages === undefined || 
                            (Array.isArray(backendResponse.messages) && backendResponse.messages.length === 0)) ||
                           (backendResponse.data !== undefined && backendResponse.data !== null);
          
          if (isSuccess) {
            this.replyForm.reset();
            this.replyingTo.set(null);
            this.loadComments(this.routeDetail()!.id);
          } else {
            console.error('Yanıt gönderilemedi:', response);
            const errorMsg = response.errorMessages?.[0] || 
                           response.messages?.[0]?.message || 
                           (backendResponse.messages?.[0]?.message) ||
                           'Yanıt gönderilemedi';
            this.toastr.error(errorMsg, 'Hata', {
              timeOut: 4000,
              positionClass: 'toast-top-right',
              progressBar: true,
              closeButton: true
            });
          }
        } else {
          console.error('Yanıt null geldi:', response);
          this.toastr.error('Yanıt gönderilemedi. Lütfen tekrar deneyin.', 'Hata', {
            timeOut: 4000,
            positionClass: 'toast-top-right',
            progressBar: true,
            closeButton: true
          });
        }
        this.isSubmittingComment.set(false);
      },
      error: (error) => {
        console.error('Yanıt gönderilirken hata oluştu:', error);
        console.error('Error details:', {
          status: error?.status,
          statusText: error?.statusText,
          error: error?.error,
          message: error?.message,
          fullError: error
        });
        
        // Backend'den gelen BaseResult yapısını kontrol et
        const backendError = error?.error;
        let errorMsg = 'Yanıt gönderilirken bir hata oluştu';
        
        if (backendError) {
          // BaseResult yapısından hata mesajını al
          if (backendError.messages && Array.isArray(backendError.messages) && backendError.messages.length > 0) {
            errorMsg = backendError.messages[0].message || backendError.messages[0].Message || errorMsg;
          } else if (backendError.errorMessages && Array.isArray(backendError.errorMessages) && backendError.errorMessages.length > 0) {
            errorMsg = backendError.errorMessages[0];
          } else if (backendError.message) {
            errorMsg = backendError.message;
          } else if (error?.message) {
            errorMsg = error.message;
          }
        }
        
        this.toastr.error(errorMsg, 'Hata', {
          timeOut: 4000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true
        });
        this.isSubmittingComment.set(false);
      }
    });
  }

  onDeleteComment(commentId: string): void {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    this.commentService.delete(commentId).subscribe({
      next: (response) => {
        if (response.isSuccess && this.routeDetail()) {
          this.loadComments(this.routeDetail()!.id);
        }
      },
      error: (error) => console.error('Yorum silinemedi:', error)
    });
  }

  cancelReply(): void {
    this.replyingTo.set(null);
    this.replyForm.reset();
  }

  onUserClick(userId: string): void {
    this.router.navigate(['/profile', userId]);
  }

  onReplyToReply(replyId: string, parentCommentId: string): void {
    // Alt yoruma yanıt verme - replyId'yi replyingTo olarak set et
    this.replyingTo.set(replyId);
    this.replyForm.reset();
  }

  showToast = signal<boolean>(false);
  toastMessage = signal<string>('');

  copyRouteLink(): void {
    const link = this.getRouteLink();
    navigator.clipboard.writeText(link).then(() => {
      this.showSuccessToast('Link kopyalandı!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showSuccessToast('Link kopyalandı!');
    });
  }

  showSuccessToast(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  getRouteLink(): string {
    const routeLink = this.routeDetail()?.routeLink;
    if (!routeLink) return '';
    return `${window.location.origin}/routes/${routeLink}`;
  }

  initMap(): void {
    const mapElement = document.getElementById('route-map');
    if (!mapElement) return;

    this.map = L.map('route-map').setView([41.008, 28.978], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  drawStops(): void {
    if (!this.map || !this.routeDetail()?.stops || this.routeDetail()!.stops!.length === 0) return;

    const stops = this.routeDetail()!.stops!;
    const coordinates: [number, number][] = [];

    stops.forEach((stop, index) => {
      coordinates.push([stop.latitude, stop.longitude]);

      let color = '#3c83f6';
      if (index === 0) color = '#22c55e';
      if (index === stops.length - 1) color = '#ef4444';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${stop.orderNumber}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([stop.latitude, stop.longitude], { icon }).addTo(this.map!);
      marker.bindPopup(`<strong>${stop.orderNumber}. ${stop.title}</strong>`);
    });

    if (coordinates.length > 1) {
      L.polyline(coordinates, {
        color: '#3c83f6',
        weight: 4,
        opacity: 0.7
      }).addTo(this.map!);
      
      this.map!.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50] });
    }
  }

  getCategoryIcon(category: any): string {
    // Önce backend'den gelen icon'u kontrol et
    if (category?.icon) {
      return category.icon;
    }
    
    // Fallback: kategori adına göre icon döndür
    const icons: { [key: string]: string } = {
      'Tarih': '🏛️',
      'Doğa': '🌳',
      'Bisiklet': '🚴',
      'Yürüyüş': '🚶',
      'Kamp': '⛺',
      'Trekking': '🥾',
      'Kültür': '🎭',
      'Gastronomi': '🍽️',
      'Macera': '⛰️',
      'Sahil': '🏖️',
      'Şehir': '🏙️',
      'Müze': '🏛️',
      'Yemek': '🍽️'
    };
    return icons[category?.name] || '📍';
  }

  getTotalRepliesCount(replies: CommentDetailDto[] | any[]): number {
    if (!replies || replies.length === 0) return 0;
    
    let count = replies.length;
    replies.forEach(reply => {
      if (reply.replies && reply.replies.length > 0) {
        count += this.getTotalRepliesCount(reply.replies);
      }
    });
    return count;
  }
}