import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService, User } from '../../../core/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { LessonService } from '../../../core/services/lesson.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-student-home',
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
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
    private lessonService: LessonService,
    private dialog: MatDialog
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
    this.router.navigate(['/student/exams']);
  }

  goToLessonDetail(lessonId: string, lesson: any) {
    if (lessonId) {
      // Check if lesson is paid
      if (lesson.price && lesson.price > 0) {
        this.showPaidLessonDialog(lessonId, lesson);
      } else {
        this.router.navigate(['/student/lesson', lessonId]);
      }
    } else {
      console.error('Lesson ID is undefined');
    }
  }

  showPaidLessonDialog(lessonId: string, lesson: any) {
    const dialogRef = this.dialog.open(PaidLessonDialogComponent, {
      width: '400px',
      data: { lesson: lesson },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'continue') {
        this.router.navigate(['/student/lesson', lessonId]);
      } else if (result === 'lessons') {
        this.router.navigate(['/student/lessons']);
      }
    });
  }

  startExam(examId: string) {
    if (examId) {
      this.router.navigate(['/student/exam-start', examId]);
    } else {
      console.error('Exam ID is undefined');
    }
  }
}

// Dialog Component for Paid Lesson Warning
@Component({
  selector: 'app-paid-lesson-dialog',
  template: `
    <div class="paid-lesson-dialog">
      <h2 mat-dialog-title>
        <mat-icon class="text-warning">lock</mat-icon>
        Premium Lesson
      </h2>
      <mat-dialog-content>
        <p>
          This lesson "<strong>{{ data.lesson.title }}</strong
          >" is a premium lesson that requires purchase.
        </p>
        <p>You can:</p>
        <ul>
          <li>Continue to view the lesson (you may need to purchase it)</li>
          <li>Go to the lessons page to see all available lessons</li>
        </ul>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close="lessons">
          <mat-icon>list</mat-icon>
          Go to Lessons
        </button>
        <button mat-raised-button color="primary" mat-dialog-close="continue">
          <mat-icon>play_arrow</mat-icon>
          Continue
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .paid-lesson-dialog {
        padding: 16px;
      }
      .paid-lesson-dialog h2 {
        color: #1976d2;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .paid-lesson-dialog ul {
        margin: 16px 0;
        padding-left: 20px;
      }
      .paid-lesson-dialog li {
        margin: 8px 0;
        color: #666;
      }
      .text-warning {
        color: #ff9800;
      }
      .paid-lesson-dialog mat-icon {
        margin-right: 4px;
      }
    `,
  ],
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  standalone: true,
})
export class PaidLessonDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { lesson: any }) {}
}
