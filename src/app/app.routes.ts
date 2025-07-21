import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ForgotResetPasswordComponent } from './auth/forgot-reset-password/forgot-reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-reset-password', component: ForgotResetPasswordComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './frontend-layout/dashboard-student/dashboard-student.component'
      ).then((m) => m.DashboardStudentComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AuthGuard],
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
  { path: '**', redirectTo: '/admin/dashboard' },
];
