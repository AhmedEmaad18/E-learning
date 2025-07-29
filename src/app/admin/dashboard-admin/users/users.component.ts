import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';
import { CreateAdminDialogComponent } from '../../create-admin-dialog/create-admin-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgClass,
    TitleCasePipe,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  currentUserRole: string | undefined;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.currentUserRole = this.authService.getCurrentUser()?.role;
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = Array.isArray(res) ? res : (res as any).data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCreateAdminDialog(): void {
    const dialogRef = this.dialog.open(CreateAdminDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createAdmin(result);
      }
    });
  }

  createAdmin(adminData: any) {
    this.http
      .post(
        'https://edu-master-delta.vercel.app/admin/create-admin',
        {
          ...adminData,
          cpassword: adminData.password,
        },
        {
          headers: { token: localStorage.getItem('token') || '' },
        }
      )
      .subscribe({
        next: () => {
          Swal.fire('Success', 'Admin created successfully!', 'success');
          this.fetchUsers();
        },
        error: () => {
          Swal.fire('Error', 'Failed to create admin.', 'error');
        },
      });
  }

  changeRole(user: any, newRole: string) {
    if (user.role === newRole) return;
    if (newRole === 'admin') {
      // Promote to admin via create-admin endpoint
      this.http
        .post(
          'https://edu-master-delta.vercel.app/admin/create-admin',
          {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            password: user.password || 'DefaultPass123!',
            cpassword: user.password || 'DefaultPass123!',
          },
          {
            headers: { token: localStorage.getItem('token') || '' },
          }
        )
        .subscribe({
          next: () => {
            Swal.fire('Success', 'User promoted to admin!', 'success');
            this.fetchUsers();
          },
          error: () => {
            Swal.fire('Error', 'Failed to promote user to admin.', 'error');
          },
        });
    } else {
      Swal.fire(
        'Info',
        'Demoting admin to user is not supported via API.',
        'info'
      );
    }
  }
}
