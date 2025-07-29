import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { LessonService } from '../../core/services/lesson.service';
import { ExamService } from '../../core/services/exam.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-dashboard-admin',
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
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  adminName: string = 'Admin';
  adminRole: string = 'Admin';
  private userSub?: Subscription;

  // Stats
  totalUsers: number = 0;
  totalLessons: number = 0;
  totalExams: number = 0;
  totalRevenue: number = 0;
  recentUsers: any[] = [];
  popularLessons: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private lessonService: LessonService,
    private examService: ExamService,
    private paymentService: PaymentService
  ) {
    const user = this.authService.getCurrentUser();
    this.adminName = user?.fullName || 'Admin';
    this.adminRole = user?.role || 'Admin';
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.adminName = user?.fullName || 'Admin';
      this.adminRole = user?.role || 'Admin';
    });

    if (!this.authService.getCurrentUser()) {
      this.authService.getProfile().subscribe();
    }

    // Fetch stats
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        const usersArr = Array.isArray(res) ? res : (res as any).data || [];
        // Sort by createdAt descending
        usersArr.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.totalUsers = usersArr.length;
        this.recentUsers = usersArr.slice(0, 2);
      },
    });
    this.lessonService.getAllLessons().subscribe({
      next: (res) => {
        this.totalLessons = Array.isArray(res)
          ? res.length
          : (res as any).data?.length || 0;
        const lessonsArr = Array.isArray(res) ? res : (res as any).data || [];
        this.popularLessons = lessonsArr.slice(0, 2);
      },
      error: (err) => {
        this.totalLessons = 0;
        this.popularLessons = [];
      },
    });
    this.examService.getAllExams().subscribe({
      next: (res) => {
        this.totalExams = Array.isArray(res)
          ? res.length
          : (res as any).data?.length || 0;
      },
    });
    this.paymentService.getRevenueFromLessons().subscribe({
      next: (res) => {
        this.totalRevenue = res;
      },
      error: () => {
        this.totalRevenue = 0;
      },
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  isDashboardRoute(): boolean {
    return this.location.path().startsWith('/admin/dashboard');
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
