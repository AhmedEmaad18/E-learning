import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile-update-dialog',
  templateUrl: './profile-update-dialog.component.html',
  styleUrl: './profile-update-dialog.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
  ],
})
export class ProfileUpdateDialogComponent {
  profileForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ProfileUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profileForm = this.fb.group({
      fullName: [
        data.currentUser?.fullName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        data.currentUser?.email || '',
        [Validators.required, Validators.email],
      ],
      phoneNumber: [
        data.currentUser?.phoneNumber || '',
        [Validators.required, Validators.pattern(/^01[0-9]{9}$/)],
      ],
      classLevel: [data.currentUser?.classLevel || '', [Validators.required]],
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.data.currentUser?._id) {
      this.loading = true;
      this.authService
        .updateProfile(this.data.currentUser._id, this.profileForm.value)
        .subscribe({
          next: (response) => {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              title: 'Profile Updated!',
              text: 'Your profile has been successfully updated.',
              confirmButtonColor: '#3f51b5',
            });
            this.dialogRef.close(true);
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

  close(): void {
    this.dialogRef.close();
  }
}
