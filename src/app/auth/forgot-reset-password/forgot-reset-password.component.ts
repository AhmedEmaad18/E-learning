import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-reset-password',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './forgot-reset-password.component.html',
  styleUrls: ['./forgot-reset-password.component.css'],
})
export class ForgotResetPasswordComponent {
  step: 'request' | 'reset' = 'request';
  loading = false;
  emailForm: FormGroup;
  resetForm: FormGroup;
  emailForReset: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetForm = this.fb.group(
      {
        otp: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: FormGroup) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  requestOtp() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const email = this.emailForm.value.email;
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.loading = false;
        this.emailForReset = email;
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: 'An OTP has been sent to your email.',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          this.step = 'reset';
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to send OTP.',
          confirmButtonColor: '#3f51b5',
        });
      },
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { otp, newPassword, confirmPassword } = this.resetForm.value;
    this.authService
      .resetPassword({
        email: this.emailForReset,
        otp,
        newPassword,
        cpassword: confirmPassword,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Password Reset',
            text: 'Your password has been reset successfully.',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.message || 'Failed to reset password.',
            confirmButtonColor: '#3f51b5',
          });
        },
      });
  }
}
