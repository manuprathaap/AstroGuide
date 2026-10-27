import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create ForgotPasswordComponent', () => {
    expect(component).toBeTruthy();
    expect(component.step()).toBe('request');
  });

  it('should validate email format', () => {
    const emailControl = component.requestForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('valid.seeker@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should advance to verify step on successful OTP request', () => {
    vi.spyOn(authService, 'forgotPassword').mockReturnValue(
      of({ message: 'OTP sent to mail', dev_otp: '654321' })
    );

    component.requestForm.setValue({ email: 'seeker@example.com' });
    component.onRequestOtp();

    expect(component.step()).toBe('verify');
    expect(component.devOtp()).toBe('654321');
    expect(component.userEmail()).toBe('seeker@example.com');
  });

  it('should advance to new_password step on successful OTP verification', () => {
    vi.spyOn(authService, 'verifyOtp').mockReturnValue(
      of({ valid: true, message: 'OTP verified', reset_token: 'secure_test_token' })
    );

    component.userEmail.set('seeker@example.com');
    component.step.set('verify');
    component.verifyForm.setValue({ code: '654321' });

    component.onVerifyOtp();

    expect(component.step()).toBe('new_password');
    expect(component.verifiedResetToken()).toBe('secure_test_token');
  });

  it('should advance to success step on successful password update', () => {
    vi.spyOn(authService, 'resetPassword').mockReturnValue(
      of({ message: 'Password reset successful' })
    );

    component.userEmail.set('seeker@example.com');
    component.verifiedResetToken.set('secure_test_token');
    component.step.set('new_password');
    component.passwordForm.setValue({
      password: 'NewStrongPassword123!',
      confirmPassword: 'NewStrongPassword123!'
    });

    component.onUpdatePassword();
    expect(component.step()).toBe('success');
  });
});
