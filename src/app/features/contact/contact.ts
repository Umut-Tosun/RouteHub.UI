import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  private toastr = inject(ToastrService);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // TODO: Backend'e gönder
      console.log('Form submitted:', this.contactForm.value);
      
      // Güzel bir toast göster
      this.toastr.success(
        `Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.`,
        '✅ Başarılı',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          progressBar: true,
          closeButton: true,
          enableHtml: true
        }
      );
      
      this.contactForm.reset();
    } else {
      this.toastr.warning('Lütfen tüm alanları doğru şekilde doldurunuz.', 'Uyarı', {
        timeOut: 4000,
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true
      });
    }
  }
}

