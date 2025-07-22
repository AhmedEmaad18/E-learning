import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../../../core/services/exam.service';
import { QuestionComponent } from './question/question.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatError } from '@angular/material/form-field';
import { ExamResultComponent } from '../exam-result/exam-result.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-exam-take',
  imports: [CommonModule, FormsModule, QuestionComponent,ReactiveFormsModule,MatChipsModule,MatButtonModule],
  templateUrl: './exam-take.component.html',
  styleUrl: './exam-take.component.css'
})
export class ExamTakeComponent implements OnDestroy,OnInit {
examId!: string;
  exam: any = null;
  studentExamId!: string;
  answers: { questionId: string; selectedAnswer: string }[] = [];
  loading = false;
  error = '';
  submitted = false;
  score: number | null = null;
timer: number = 0; // duration in seconds (or minutes, depending on your API)
timeLeft: number = 0; // time left in seconds
timerInterval: any; // to hold setInterval reference

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    protected router: Router,private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const examId = params.get('examId');
      if (examId) {
        this.examId = examId;
        this.startExam();
      } else {
        this.error = 'Invalid exam ID';
      }
    });

  }
   getSelectedAnswersCount(): number {
       return this.answers.filter(a => a.selectedAnswer).length;
   }
startTimer() {
  this.timerInterval = setInterval(() => {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      clearInterval(this.timerInterval);
      this.submitExam();  // Auto-submit when time runs out
    }
  }, 1000);
}
formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
  startExam() {
  this.loading = true;
  this.examService.startExam(this.examId).subscribe({
    next: (res) => {
      if (res.success && res.data?.exam) {
        // 👉 Use the actual exam ID for submissions
        this.studentExamId = res.data.exam._id;
this.timer = res.data.exam.duration * 60; // Convert minutes to seconds
this.timeLeft = this.timer;

this.startTimer();


        // Handle questions array (IDs) vs. full objects
        if (
          res.data.exam.questions.length > 0 &&
          typeof res.data.exam.questions[0] === 'string'
        ) {
          this.examService.getExamById(this.studentExamId).subscribe({
            next: (examRes) => {
             if (examRes.success && examRes.data) {
  this.exam = examRes.data;
  this.initAnswers();
} else {
  this.error = 'Failed to load full exam details';
}

              this.loading = false;
            },
            error: () => {
              this.error = 'Failed to fetch exam details';
              this.loading = false;
            },
          });
        } else {
          this.exam = res.data.exam;
          console.log(this.exam)
          this.initAnswers();
          this.loading = false;
        }
      } else {
        this.error = res.message || 'Failed to start exam';
        this.loading = false;
      }
    },
    error: () => {
      this.error = 'Error starting exam';
      this.loading = false;
    },
  });
}

   currentQuestionIndex = 0;

  // Other properties remain the same...
  // Updated initAnswers to track answered questions
  initAnswers() {
    this.answers = this.exam.questions.map((q: any) => ({
      questionId: q._id,
      selectedAnswer: '',
    }));
  }
  isAnswered(index: number): boolean {
    return this.answers[index]?.selectedAnswer !== '';
  }
  selectQuestion(index: number) {
    this.currentQuestionIndex = index;
  }
  get currentQuestion() {
    return this.exam.questions[this.currentQuestionIndex];
  }
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }
  submitCurrentQuestion() {
    const currentAnswer = this.answers[this.currentQuestionIndex];
    // Submit current answer
    this.onAnswerChange({ questionId: currentAnswer.questionId, selectedAnswer: currentAnswer.selectedAnswer });
    if (this.currentQuestionIndex < this.exam.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitExam();
    }
  }

  onAnswerChange(event: { questionId: string; selectedAnswer: string }) {
    const answer = this.answers.find(a => a.questionId === event.questionId);
    if (answer) {
      answer.selectedAnswer = event.selectedAnswer;
    }
  }

  getSelectedAnswer(questionId: string): string | null {
  const answer = this.answers.find(a => a.questionId === questionId);
  return answer ? answer.selectedAnswer : null;
}




showResult(score: number, totalPoints: number) {
  const dialogRef = this.dialog.open(ExamResultComponent, {
    data: { score, totalPoints },
    width: '300px',
  });

  dialogRef.afterClosed().subscribe(() => {
    this.router.navigate(['/exam-list']);
  });
}

submitExam() {
  this.examService.submitExam(this.studentExamId, this.answers).subscribe({
    next: (res) => {
      if (res.data && typeof res.data.score === 'number' && typeof res.data.totalPoints === 'number') {
        this.showResult(res.data.score, res.data.totalPoints);
      }
    },
    error: (err) => {
      this.error = `Error submitting exam: ${err.message}`;
    }
  });
}

  fetchScore() {
    this.examService.getExamScoreStudent(this.studentExamId).subscribe({
      next: (res) => {
        if (res && res.data && res.data.score !== undefined) {
          this.score = res.data.score;
        }
      },
    });
  }

}
