import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard, AdminGuard } from './core/guard/auth.guard';
import { ForgotResetPasswordComponent } from './auth/forgot-reset-password/forgot-reset-password.component';
import { RedirectHandlerComponent } from './core/auth/redirect-handler/redirect-handler.component';

export const routes: Routes = [
  { path: '', component: RedirectHandlerComponent, pathMatch: 'full' },
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
            './frontend-layout/dashboard-student/lesson-list/lesson-list.component'
          ).then((m) => m.LessonListComponent),
      },
      {
        path: 'lesson/:id',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/lesson-detail/lesson-detail.component'
          ).then((m) => m.LessonDetailComponent),
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
      },{
        path: 'exam-list',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/exams/exam-list/exam-list.component'
          ).then((m) => m.ExamListComponent),
      },{
        path: 'exam-start/:examId',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/exams/exam-take/exam-take.component'
          ).then((m) => m.ExamTakeComponent),
      },{
        path: 'exam-results/:studentExamId',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/exams/exam-result/exam-result.component'
          ).then((m) => m.ExamResultComponent),
      },{
        path: 'pay',
        loadComponent: () =>
          import(
            './frontend-layout/dashboard-student/lesson-list/payment/payment.component'
          ).then((m) => m.PaymentComponent),
      },
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
        path: 'lessons/add',
        loadComponent: () =>
          import(
            './admin/dashboard-admin/manage-lessons/lesson-form/lesson-form.component'
          ).then((m) =>m.LessonFormComponent),
      },
      {
        path: 'lessons/edit',
        loadComponent: () =>
          import(
            './admin/dashboard-admin/manage-lessons/lesson-form/lesson-form.component'
          ).then((m) =>m.LessonFormComponent),
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
  { path: '**', redirectTo: '' },
];
