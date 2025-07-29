import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionService } from '../../../../../core/services/question.service';
import { ManageexamService } from '../../../../../core/services/manageexam.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamDetails } from '../../../../../core/models/model';

@Component({
  selector: 'app-add-questions-to-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-questions-to-exam.component.html',
  styleUrls: ['./add-questions-to-exam.component.css']
})
export class AddQuestionsToExamComponent {
  @Input() exam!: ExamDetails;
  @Output() close = new EventEmitter<void>();
  @Output() questionAdded = new EventEmitter<void>();

  availableQuestions: any[] = [];
  filters = { msq: true, tf: true, short: true };
  selectedIds = new Set<string>();
  loading = false;

  question: any = {
    text: '',
    type: '',
    options: [],
    correctAnswer: '',
    exam: '',
    points: 1
  };

  constructor(
    private questionSvc: QuestionService,
    private examSvc: ManageexamService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadQuestions();
    this.question.exam = this.exam._id;
  }

  loadQuestions() {
    this.loading = true;
    this.questionSvc.getAllQuestions().subscribe({
      next: res => {
        this.availableQuestions = res.data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Cannot load questions');
        this.loading = false;
      }
    });
  }

  filteredQuestions() {
    return this.availableQuestions.filter(q =>
      (q.type === 'multiple-choice' && this.filters.msq) ||
      (q.type === 'true-false' && this.filters.tf) ||
      (q.type === 'short-answer' && this.filters.short)
    );
  }

  toggleSelection(id: string) {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }
assign() {
  const existingIds = (this.exam.questions || []).map(q => typeof q === 'string' ? q : q._id);
  const ids = Array.from(new Set([...existingIds, ...this.selectedIds]));

  this.examSvc.updateExam(this.exam._id!, {
    questions: ids,
    isPublished: true // <-- set published to true here
  }).subscribe({
    next: () => {
      this.toastr.success('Questions added to exam');
      this.close.emit();
      this.questionAdded.emit();
    },
    error: err => {
      this.toastr.error('Failed to assign');
      console.error(err);
    }
  });
}


  addOption() {
    this.question.options.push('');
  }

  removeOption(index: number) {
    this.question.options.splice(index, 1);
  }
submit() {
  const basePayload: any = {
    text: this.question.text,
    type: this.question.type,
    correctAnswer: this.question.correctAnswer,
    exam: this.exam._id,
    points: this.question.points
  };

  if (this.question.type === 'multiple-choice') {
    basePayload.options = this.question.options;
  }

  this.questionSvc.createQuestion(basePayload).subscribe({
    next: (res) => {
      const newQuestionId = res.data?._id;
      const existingIds = (this.exam.questions || []).map(q => typeof q === 'string' ? q : q._id);
      const updatedIds = [...existingIds, newQuestionId];

      this.examSvc.updateExam(this.exam._id, {
        questions: updatedIds,
        isPublished: true
      }).subscribe({
        next: () => {
          this.toastr.success('Question added and exam published');
          this.resetForm();
          this.loadQuestions();
          this.questionAdded.emit();
        },
        error: () => {
          this.toastr.error('Failed to update exam');
        }
      });
    },
    error: () => {
      this.toastr.error('Failed to add question');
    }
  });
}



  resetForm() {
    this.question = {
      text: '',
      type: '',
      options: [],
      correctAnswer: '',
      exam: this.exam._id,
      points: 1
    };
  }
}
