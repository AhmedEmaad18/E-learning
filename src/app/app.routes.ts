import { Routes } from '@angular/router';

import { ExamListComponent } from './frontend-layout/dashboard-student/exams/exam-list/exam-list.component';
import { ExamTakeComponent } from './frontend-layout/dashboard-student/exams/exam-take/exam-take.component';
import { ExamResultComponent } from './frontend-layout/dashboard-student/exams/exam-result/exam-result.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard, AdminGuard } from './core/guard/auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';
import { ForgotResetPasswordComponent } from './auth/forgot-reset-password/forgot-reset-password.component';

function roleBasedRedirect() {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  if (user?.role && user.role.toLowerCase().includes('admin')) {
    return '/admin/dashboard';
  } else if (user) {
    return '/student/dashboard';
  } else {
    return '/login';
  }
}

export const routes: Routes = [
  { path: '', redirectTo: roleBasedRedirect, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-reset-password', component: ForgotResetPasswordComponent },
  {
    path: 'student',
    loadComponent: () =>
      import(
        './frontend-layout/dashboard-student/dashboard-student.component'
      ).then((m) => m.DashboardStudentComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/dashboard-student-home/dashboard-student-home.component'
          ).then((m) => m.DashboardStudentHomeComponent),
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/lessons/lessons.component'
          ).then((m) => m.LessonsComponent),
      },
      {
        path: 'exams',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/exams/exams.component'
          ).then((m) => m.ExamsComponent),
      },
      {
        path: 'my-lessons',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/my-lessons/my-lessons.component'
          ).then((m) => m.MyLessonsComponent),
      },
      {
        path: 'my-scores',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/my-scores/my-scores.component'
          ).then((m) => m.MyScoresComponent),
      },
    { path: 'exam-list', component: ExamListComponent },
  { path: 'exam-start/:examId', component: ExamTakeComponent },  // changed param name here
  { path: 'exam-results/:studentExamId', component: ExamResultComponent }, // likewise here
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard-admin/dashboard-admin.component').then(
            (m) => m.DashboardAdminComponent
          ),
      },
      {
        path: 'manage-lessons',
        loadComponent: () =>
          import(
            './admin/dashboard-admin/manage-lessons/manage-lessons.component'
          ).then((m) => m.ManageLessonsComponent),
      },
      {
        path: 'manage-exams',
        loadComponent: () =>
          import(
            './admin/dashboard-admin/manage-exams/manage-exams.component'
          ).then((m) => m.ManageExamsComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/dashboard-admin/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/dashboard-admin/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
    ],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./info/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: roleBasedRedirect },
];
