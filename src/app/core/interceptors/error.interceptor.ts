import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/stroge.service';



export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Bir hata oluştu';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Hata: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            // Unauthorized - Token geçersiz
            storageService.clearAll();
            router.navigate(['/auth/login']);
            errorMessage = 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
            break;
          case 403:
            errorMessage = 'Bu işlem için yetkiniz yok.';
            break;
          case 404:
            errorMessage = 'İstenen kaynak bulunamadı.';
            break;
          case 500:
            errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
            break;
          default:
            if (error.error?.errorMessages?.length > 0) {
              errorMessage = error.error.errorMessages.join(', ');
            } else {
              errorMessage = `Hata kodu: ${error.status}`;
            }
        }
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};