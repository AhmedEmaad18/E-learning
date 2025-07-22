import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  matcher = new ErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          // After login, fetch the latest user profile
          this.authService.getProfile().subscribe({
            next: (user) => {
              this.loading = false;
              Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                text: response.message || 'Login successful',
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                const role = user?.role?.toLowerCase();
                if (
                  role === 'admin' ||
                  role === 'super_admin' ||
                  role === 'superadmin'
                ) {
                  this.router.navigate(['/admin/dashboard']);
                } else {
                  this.router.navigate(['/student/dashboard']);
                }
              });
            },
            error: () => {
              this.loading = false;
              Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Could not fetch user profile.',
                confirmButtonColor: '#3f51b5',
              });
            },
          });
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.error?.message || 'Invalid email or password',
            confirmButtonColor: '#3f51b5',
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${
        controlName.charAt(0).toUpperCase() + controlName.slice(1)
      } must be at least 6 characters`;
    }
    return '';
  }
}
