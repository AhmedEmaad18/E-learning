import { Component } from '@angular/core';
import { ExamService } from '../../../../core/services/exam.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Exam } from '../../../../core/models/model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-exam-list',
  imports: [CommonModule,MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,DatePipe],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent {
  exams: any[] = [];
  availableExams: any[] = [];
  completedExams: any[] = [];
  loading = false;
    showAvailable: boolean = true;

  error = '';
questionId:string= "687e307e9261e171f57c3c25";
selectedAnswer:string= "200";
  answers: { questionId: string; selectedAnswer: string }[] = [{questionId:"687e307e9261e171f57c3c25",
selectedAnswer: "200"}];

  constructor(private examService: ExamService, private router: Router,  private authService: AuthService // add this
) {}

  ngOnInit() {
    this.loadExams();
  }
averageScore: string | number = '-';
async loadExams() {
  this.loading = true;
  this.error = '';
  this.availableExams = [];
  this.completedExams = [];

  try {
 const user = this.authService.getCurrentUser();
    const studentClassLevel = user?.classLevel;

    const res = await firstValueFrom(this.examService.getExams());

    if (res?.success && res.data) {
      const filteredExams = res.data.filter(
        (exam: any) => exam.classLevel === studentClassLevel
      );

      this.exams = filteredExams as Exam[];
      const statusChecks = this.exams.map(async (exam) => {
        let dummyAnswers: { questionId: string; selectedAnswer: string }[] = [];

        if (exam.questions?.length > 0) {
          const question = exam.questions[0];
          const selectedAnswer = question.options?.[0]?._id || '200';
          dummyAnswers = [{ questionId: question._id, selectedAnswer }];
        }

        try {
          const status = await firstValueFrom(
            this.examService.checkExamSubmissionStatus(exam._id, dummyAnswers)
          );
          const isCompleted =
            status.success || !status.message?.toLowerCase().includes('not started');
          return { exam, completed: isCompleted };
        } catch (err: any) {
          const message = err?.error?.message?.toLowerCase();
          return { exam, completed: !(message?.includes('not started')) };
        }
      });

      const results = await Promise.all(statusChecks);

      this.availableExams = results.filter(r => !r.completed).map(r => r.exam);
      this.completedExams = results.filter(r => r.completed).map(r => r.exam);

      const scorePromises = this.completedExams.map(async (exam) => {
        try {
          const scoreRes = await firstValueFrom(
            this.examService.getExamScoreStudent(exam._id)
          );
          if (scoreRes?.success) {
            exam.score = scoreRes.data.score;
            exam.scoreRawResponse = JSON.stringify(scoreRes.data);
          } else {
            exam.score = '-';
          }
        } catch {
          exam.score = '-';
        }
        return exam;
      });

      await Promise.all(scorePromises);

      const scores = this.completedExams
        .map(e => typeof e.score === 'number' ? e.score : null)
        .filter(score => score !== null) as number[];

      this.averageScore = scores.length
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : '-';
        console.log(scores.length)

      this.examService.setAverageScore(this.averageScore);

    } else {
      this.error = res?.message || 'Failed to load exams';
    }
  } catch (error) {
    console.error('Error loading exams:', error);
    this.error = 'Error loading exams';
  } finally {
    this.loading = false;
  }
}

  startExam(examId: string) {
    this.router.navigate(['student/exam-start', examId]);
  }

}
