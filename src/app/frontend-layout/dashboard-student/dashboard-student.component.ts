import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-dashboard-student',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './dashboard-student.component.html',
  styleUrl: './dashboard-student.component.css',
})
export class DashboardStudentComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  studentName: string = 'Student';

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser();
    this.studentName = user?.fullName || 'Student';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
