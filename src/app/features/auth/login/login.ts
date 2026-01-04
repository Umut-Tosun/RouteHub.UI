import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/']);
        } else {
          // Backend'den gelen hata mesajlarını göster
          const errorMsg = response.errorMessages?.[0] || 
                         response.messages?.[0]?.message || 
                         'Giriş başarısız';
          this.errorMessage.set(errorMsg);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        // Backend'den gelen hata mesajlarını göster
        console.error('Login error:', error);
        const errorMsg = error?.error?.errorMessages?.[0] || 
                        error?.error?.messages?.[0]?.message ||
                        error?.error?.message ||
                        error?.message || 
                        'Bir hata oluştu. Lütfen tekrar deneyin.';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }
}

