import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value && confirmPassword.value) {
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        const errors = { ...confirmPassword.errors };
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }
  return null;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Progressive steps: 'request' -> 'verify' -> 'new_password' -> 'success'
  readonly step = signal<'request' | 'verify' | 'new_password' | 'success'>('request');
  readonly userEmail = signal<string>('');
  readonly devOtp = signal<string | null>(null);
  readonly verifiedResetToken = signal<string | null>(null);

  readonly isLoading = signal<boolean>(false);
  readonly isResending = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly infoMessage = signal<string | null>(null);

  readonly showPassword = signal<boolean>(false);
  readonly showConfirmPassword = signal<boolean>(false);
  readonly resendCountdown = signal<number>(0);

  private countdownTimer: any = null;

  // Form 1: Request OTP
  readonly requestForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Form 2: Verify OTP Section
  readonly verifyForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]]
  });

  // Form 3: Set New Password
  readonly passwordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    const codeParam = this.route.snapshot.queryParamMap.get('code');

    if (emailParam) {
      this.requestForm.patchValue({ email: emailParam });
      this.userEmail.set(emailParam.trim());
    }

    if (codeParam) {
      this.verifyForm.patchValue({ code: codeParam });
      if (emailParam) {
        this.step.set('verify');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  startResendCountdown(seconds: number = 60): void {
    this.resendCountdown.set(seconds);
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    this.countdownTimer = setInterval(() => {
      const current = this.resendCountdown();
      if (current <= 1) {
        this.resendCountdown.set(0);
        clearInterval(this.countdownTimer);
      } else {
        this.resendCountdown.set(current - 1);
      }
    }, 1000);
  }

  fillDevOtp(): void {
    const code = this.devOtp();
    if (code) {
      this.verifyForm.patchValue({ code });
      this.verifyForm.get('code')?.markAsDirty();
    }
  }

  // Step 1: Send OTP to mail
  onRequestOtp(): void {
    if (this.requestForm.invalid || this.isLoading()) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.infoMessage.set(null);

    const email = this.requestForm.getRawValue().email!.trim();

    this.authService.forgotPassword({ email }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.userEmail.set(email);
        this.devOtp.set(res.dev_otp || null);

        if (!res.dev_otp && res.message.includes('not found')) {
          this.errorMessage.set(res.message);
          return;
        }

        this.infoMessage.set('A 6-digit OTP verification code has been dispatched to your mail ID.');
        this.step.set('verify');
        this.startResendCountdown(60);
      },

      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // Step 2: Verify OTP
  onVerifyOtp(): void {
    if (this.verifyForm.invalid || this.isLoading()) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const code = this.verifyForm.getRawValue().code!.trim();

    this.authService
      .verifyOtp({
        email: this.userEmail(),
        code: code
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.verifiedResetToken.set(res.reset_token || code);
          this.infoMessage.set('OTP verified successfully! Now create your new password.');
          this.step.set('new_password');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.authService.formatErrorMessage(err));
        }
      });
  }

  // Resend OTP
  onResendOtp(): void {
    if (this.resendCountdown() > 0 || this.isResending()) {
      return;
    }

    this.isResending.set(true);
    this.errorMessage.set(null);

    this.authService.forgotPassword({ email: this.userEmail() }).subscribe({
      next: (res) => {
        this.isResending.set(false);
        this.devOtp.set(res.dev_otp || null);
        this.infoMessage.set('A new OTP verification code has been sent to your mail ID.');
        this.startResendCountdown(60);
      },
      error: (err) => {
        this.isResending.set(false);
        this.errorMessage.set(this.authService.formatErrorMessage(err));
      }
    });
  }

  // Step 3: Update Password
  onUpdatePassword(): void {
    if (this.passwordForm.invalid || this.isLoading()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { password } = this.passwordForm.getRawValue();
    const token = this.verifiedResetToken() || this.verifyForm.getRawValue().code!.trim();

    this.authService
      .resetPassword({
        email: this.userEmail(),
        code: token,
        new_password: password!
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.step.set('success');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.authService.formatErrorMessage(err));
        }
      });
  }

  backToEmail(): void {
    this.step.set('request');
    this.errorMessage.set(null);
    this.infoMessage.set(null);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: {
        message: 'Password reset successful! Sign in with your new celestial credentials.'
      }
    });
  }
}
