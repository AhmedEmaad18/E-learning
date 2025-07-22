import { Component } from '@angular/core';
import { DashboardStudentComponent } from './dashboard-student/dashboard-student.component';

@Component({
  selector: 'app-frontend-layout',
  imports: [DashboardStudentComponent],
  templateUrl: './frontend-layout.component.html',
  styleUrl: './frontend-layout.component.css',
})
export class FrontendLayoutComponent {}
