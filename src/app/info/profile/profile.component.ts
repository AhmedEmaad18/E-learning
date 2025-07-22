import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ForgotResetPasswordComponent } from '../../auth/forgot-reset-password/forgot-reset-password.component';
import { ProfileUpdateDialogComponent } from './profile-update-dialog/profile-update-dialog.component';
import { PasswordUpdateDialogComponent } from './password-update-dialog/password-update-dialog.component';
import { CreateAdminDialogComponent } from '../../admin/create-admin-dialog/create-admin-dialog.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  loading = false;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      fullName: [
        this.currentUser?.fullName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        this.currentUser?.email || '',
        [Validators.required, Validators.email],
      ],
      phoneNumber: [
        this.currentUser?.phoneNumber || '',
        [Validators.required, Validators.pattern(/^01[0-9]{9}$/)],
      ],
      classLevel: [this.currentUser?.classLevel || '', [Validators.required]],
    });
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          classLevel: user.classLevel,
        });
      },
    });
  }

  passwordMatchValidator(control: any): { [key: string]: any } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.loading = true;
      const { oldPassword, newPassword, confirmPassword } =
        this.passwordForm.value;

      this.authService
        .updatePassword({
          oldPassword,
          newPassword,
          cpassword: confirmPassword,
        })
        .subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Password Updated!',
              text: 'Your password has been successfully updated.',
              confirmButtonColor: '#3f51b5',
            });
            this.passwordForm.reset();
          },
          error: (error) => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text:
                error.error?.message ||
                'Failed to update password. Please check your old password.',
              confirmButtonColor: '#3f51b5',
            });
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.currentUser?._id) {
      this.loading = true;
      this.authService
        .updateProfile(this.currentUser._id, this.profileForm.value)
        .subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Profile Updated!',
              text: 'Your profile has been successfully updated.',
              confirmButtonColor: '#3f51b5',
            });
            // Optionally update local user
            this.currentUser = {
              ...this.currentUser,
              ...this.profileForm.value,
            };
          },
          error: (error) => {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: error.error?.message || 'Failed to update profile.',
              confirmButtonColor: '#3f51b5',
            });
          },
        });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach((key) => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'old':
        this.hideOldPassword = !this.hideOldPassword;
        break;
      case 'new':
        this.hideNewPassword = !this.hideNewPassword;
        break;
      case 'confirm':
        this.hideConfirmPassword = !this.hideConfirmPassword;
        break;
    }
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  openForgotPasswordDialog(): void {
    this.dialog.open(ForgotResetPasswordComponent, {
      width: '400px',
      disableClose: false,
    });
  }

  openProfileUpdateDialog(): void {
    this.dialog.open(ProfileUpdateDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { currentUser: this.currentUser },
    });
  }

  openPasswordUpdateDialog(): void {
    this.dialog.open(PasswordUpdateDialogComponent, {
      width: '500px',
      disableClose: false,
      data: { currentUser: this.currentUser },
    });
  }

  confirmDeleteAccount(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete your account. This cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete my account',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount(): void {
    if (!this.currentUser?._id) return;
    this.loading = true;
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been deleted.',
          confirmButtonColor: '#3f51b5',
        }).then(() => {
          this.logout();
        });
      },
      error: (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.error?.message || 'Failed to delete account.',
          confirmButtonColor: '#3f51b5',
        });
      },
    });
  }

  backToDashboard() {
    if (
      this.currentUser?.role &&
      this.currentUser.role.toLowerCase().includes('admin')
    ) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/student/dashboard']);
    }
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'SUPER_ADMIN';
  }

  openCreateAdminDialog(): void {
    this.dialog.open(CreateAdminDialogComponent, {
      width: '500px',
      disableClose: false,
    });
  }
}
