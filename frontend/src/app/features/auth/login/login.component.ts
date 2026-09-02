import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    // Check if user was redirected from registration or guard with a query message
    const msg = this.route.snapshot.queryParamMap.get('message');
    if (msg) {
      this.successMessage.set(msg);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({
      email: email!.trim(),
      password: password!
    }).subscribe({
      next: () => {
        // Upon login success and token storage, query /auth/me to check user's language_id
        this.authService.getMe().subscribe({
          next: (user) => {
            this.isLoading.set(false);
            if (user.language_id !== null && user.language_id !== undefined) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/language']);
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(this.authService.formatErrorMessage(err));
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }
}
