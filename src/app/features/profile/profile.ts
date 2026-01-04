import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { RouteService } from '../../core/services/route';
import { CommentService } from '../../core/services/comment';
import { Route as RouteModel } from '../../models/route.model';
import { GetUserByIdQueryResult, RouteBasicDto } from '../../models/user.model';
import { CommentDetailDto } from '../../models/comment.model';
import { ApiResponse } from '../../models/api-response.model';
import { RouteCard } from '../../shared/components/route-card/route-card';

type TabType = 'routes' | 'comments';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, RouteCard],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);
  private routeService = inject(RouteService);
  private commentService = inject(CommentService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  user = signal<GetUserByIdQueryResult | null>(null);
  routes = signal<RouteModel[]>([]);
  comments = signal<CommentDetailDto[]>([]);
  isLoading = signal<boolean>(true);
  activeTab = signal<TabType>('routes');
  isEditingProfile = signal<boolean>(false);
  isOwnProfile = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return currentUser && this.user() && currentUser.id === this.user()!.id;
  });

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.loadUserProfile(userId);
    } else {
      // Eğer userId yoksa, kendi profilini göster
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        // Kendi profilini backend'den yükle (rotaları almak için)
        this.loadUserProfile(currentUser.id);
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  loadUserProfile(userId: string): void {
    this.isLoading.set(true);
    this.apiService.get<ApiResponse<GetUserByIdQueryResult>>(`/users/${userId}`).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.user.set(response.data);
          this.loadUserRoutes(userId);
          if (this.activeTab() === 'comments') {
            this.loadUserComments(userId);
          }
        } else {
          console.error('Kullanıcı profili yüklenemedi:', response.errorMessages);
          this.router.navigate(['/']); // Kullanıcı bulunamazsa ana sayfaya yönlendir
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('Kullanıcı profili yüklenirken hata oluştu:', error);
        this.isLoading.set(false);
        this.router.navigate(['/']);
      }
    });
  }

  loadUserRoutes(userId: string): void {
    // Kullanıcı bilgilerinden rotaları al (backend'den gelen routes)
    if (this.user()?.routes && this.user()!.routes!.length > 0) {
      // RouteBasicDto'yu RouteModel'e dönüştür
      const routeModels: RouteModel[] = this.user()!.routes!.map(r => ({
        id: r.id,
        title: r.title,
        routeLink: r.routeLink,
        isPublic: r.isPublic,
        viewCount: r.viewCount || 0,
        thumbnailUrl: r.thumbnailUrl,
        status: r.status,
        createdDate: new Date(),
        stopCount: r.stopCount || 0,
        commentCount: r.commentCount || 0,
        user: this.user() ? {
          id: this.user()!.id,
          firstName: this.user()!.firstName,
          lastName: this.user()!.lastName,
          userName: this.user()!.userName,
          profileImageUrl: this.user()!.profileImageUrl
        } : undefined,
        categories: undefined
      }));
      this.routes.set(routeModels);
      this.isLoading.set(false);
    } else {
      // Fallback: Tüm rotaları getir ve filtrele
      this.routeService.getAll().subscribe({
        next: (response) => {
          if (response.isSuccess && response.data) {
            const userRoutes = response.data.filter(r => r.user?.id === userId);
            this.routes.set(userRoutes);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  loadUserComments(userId: string): void {
    this.commentService.getByUser(userId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.comments.set(response.data);
        }
      },
      error: (error) => console.error('Yorumlar yüklenemedi:', error)
    });
  }

  onEditProfile(): void {
    this.isEditingProfile.set(true);
    // TODO: Profil düzenleme modalı veya sayfası aç
    // Şimdilik basit bir toast göster
    this.toastr.info('Profil düzenleme özelliği yakında eklenecek!', 'Bilgi', {
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  onUploadCoverImage(): void {
    // TODO: Cover image upload
    console.log('Cover image upload');
  }

  onUploadProfileImage(): void {
    // TODO: Profile image upload
    console.log('Profile image upload');
  }

  onTabChange(tab: TabType): void {
    this.activeTab.set(tab);
    if (tab === 'comments' && this.user()) {
      this.loadUserComments(this.user()!.id);
    }
  }

  onRouteCardClick(route: RouteModel): void {
    this.router.navigate(['/routes', route.routeLink]);
  }

  onCommentRouteClick(routeId: string): void {
    this.routeService.getById(routeId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.router.navigate(['/routes', response.data.routeLink]);
        }
      }
    });
  }

  getInitials(): string {
    const user = this.user();
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  }
}

