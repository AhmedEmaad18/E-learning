import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { QuestionService } from '../../../../core/services/question.service';
import { ExamDetails } from '../../../../core/models/model';

import { AddQuestionsToExamComponent } from './add-questions-to-exam/add-questions-to-exam.component';
import { EditquestionComponent } from './editquestion/editquestion.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddQuestionsToExamComponent,
    EditquestionComponent
  ],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  @Input() exam!: ExamDetails;

  questions: any[] = [];
  loading = false;

  adding = false;
  editing = false;

  selectedQuestion: any = null;
  questionKey = 0;

  deleteLoadingId: string | null = null;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(
    private questionSvc: QuestionService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  // ----------------------------
  // Pagination
  // ----------------------------
  get pagedQuestions() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.questions.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.questions.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ----------------------------
  // Question Management
  // ----------------------------
  loadQuestions() {
    this.loading = true;
    this.questionSvc.getAllQuestions().subscribe({
      next: res => {
        this.questions = res.data.filter(q => q.exam === this.exam._id);
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load questions');
        this.loading = false;
      }
    });
  }

  showAddForm() {
    this.adding = true;
  }

  cancelAdd() {
    this.adding = false;
  }

  handleQuestionAdded() {
    this.toastr.success('Question added');
    this.adding = false;
    this.loadQuestions();

    setTimeout(() => {
      const modalBody = document.querySelector('.modal-body');
      if (modalBody) {
        modalBody.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }

  deleteQuestion(questionId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This question will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteLoadingId = questionId;

        this.questionSvc.deleteQuestion(questionId).subscribe({
          next: () => {
            this.toastr.success('Question deleted');
            this.loadQuestions();
          },
          error: () => {
            this.toastr.error('Failed to delete question');
          },
          complete: () => {
            this.deleteLoadingId = null;
          }
        });
      }
    });
  }

  // ----------------------------
  // Edit Question Modal
  // ----------------------------
  openEdit(question: any) {
    this.selectedQuestion = { ...question }; // clone to prevent live binding
    this.questionKey++; // trigger re-render
    this.editing = true;
  }

  closeEdit() {
    this.editing = false;
    this.selectedQuestion = null;
  }

  handleQuestionUpdated(updatedQuestion: any) {
    const idx = this.questions.findIndex(q => q._id === updatedQuestion._id);
    if (idx !== -1) {
      this.questions[idx] = updatedQuestion;
    }

    this.selectedQuestion = { ...updatedQuestion };
    this.toastr.success('Question updated');
    this.closeEdit();
  }
}
