import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { LessonService } from '../../../core/services/lesson.service';

@Component({
  selector: 'app-dashboard-student-home',
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './dashboard-student-home.component.html',
  styleUrl: './dashboard-student-home.component.css',
})
export class DashboardStudentHomeComponent implements OnInit {
  user: User | null = null;
  loading = true;
  lessons: any[] = [];
  lessonsError: string | null = null;
  exams: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private examService: ExamService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token });

    // Fetch lessons using LessonService
    this.lessonService.getAllLessons().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.lessons = response.slice(0, 5);
        } else if (Array.isArray(response.data)) {
          this.lessons = response.data.slice(0, 5);
        } else {
          this.lessons = [];
        }
        this.lessonsError = null;
        this.loading = false;
      },
      error: () => {
        this.lessons = [];
        this.lessonsError = 'No lessons found.';
        this.loading = false;
      },
    });

    // Fetch some exams for preview
    this.examService.getAllExams().subscribe({
      next: (response: any) => {
        if (Array.isArray(response.data)) {
          this.exams = response.data.slice(0, 5);
        } else {
          this.exams = [];
        }
      },
      error: () => {
        this.exams = [];
      },
    });
  }

  goToLessons() {
    this.router.navigate(['/student/lessons']);
  }

  goToExams() {
    this.router.navigate(['/student/exam-list']);
  }
}
