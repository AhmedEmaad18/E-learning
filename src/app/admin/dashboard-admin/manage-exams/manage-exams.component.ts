import { Component, OnInit } from '@angular/core';
import { ManageexamService } from '../../../core/services/manageexam.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditExamComponent } from './edit-exam/edit-exam.component';
import { ExamDetails } from '../../../core/models/model';
import { AddExamComponent } from './add-exam/add-exam.component';
import { QuestionComponent } from '../../../frontend-layout/dashboard-student/exams/exam-take/question/question.component';
import { AddQuestionsToExamComponent } from './questions/add-questions-to-exam/add-questions-to-exam.component';
import { QuestionsComponent } from './questions/questions.component';
import Swal from 'sweetalert2';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ExamscoreComponent } from './examscore/examscore.component';

@Component({
  selector: 'app-manage-exams',
  standalone: true,               // Add standalone if you use imports here
  imports: [CommonModule, FormsModule,EditExamComponent,AddExamComponent,QuestionsComponent,ExamscoreComponent],
  templateUrl: './manage-exams.component.html',
  styleUrls: ['./manage-exams.component.css'] // Fix typo here
})
export class ManageExamsComponent implements OnInit {
  exams: ExamDetails[] = [];
selectedExam: ExamDetails | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private examService: ManageexamService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.error = null;

    this.examService.getAllExams().subscribe({
  next: (res) => {
    this.exams = res.data;
    this.loading = false;
  },
  error: (err) => {
    this.error = 'Failed to load exams';
    this.loading = false;
    console.error(err);
  },
});

  }

 editExam(exam: any): void {
  this.selectedExam = null; // Clear it first (forces ngIf to rerender cleanly)

  // Delay reassigning to allow DOM to reset (fixes double modal flicker)
  setTimeout(() => {
    this.selectedExam = JSON.parse(JSON.stringify(exam));
  }, 0);
}
trackByExamId(index: number, exam: ExamDetails) {
  return exam._id;
}


cancelEdit(): void {
  this.selectedExam = null;
}

handleSave(updatedExam: ExamDetails | any) {
  // Prepare questions array: if they are objects, extract _id, else keep as string
  const questions = (updatedExam.questions || []).map((q: any) =>
    typeof q === 'string' ? q : q._id
  );

  // Create update payload excluding forbidden fields
  const updatePayload = {
    title: updatedExam.title,
    description: updatedExam.description,
    duration: updatedExam.duration,
    questions,
    classLevel: updatedExam.classLevel,
    isPublished: updatedExam.isPublished,
    startDate: updatedExam.startDate,
    endDate: updatedExam.endDate,
  };

  this.examService.updateExam(updatedExam._id, updatePayload).subscribe({
    next: () => {
      this.toastr.success('Exam updated successfully');
      this.selectedExam = null;
      this.loadExams();
    },
    error: (err) => {
      this.toastr.error('Update failed');
      console.error(err);
    },
  });
}



  saveExam(): void {
    if (!this.selectedExam) return;

    this.examService.updateExam(this.selectedExam._id, this.selectedExam).subscribe({
      next: () => {
        this.toastr.success('Exam updated successfully');
        this.selectedExam = null;
        this.loadExams();
      },
      error: (err) => {
        this.toastr.error('Update failed');
        console.error(err);
      },
    });
  }

  deleteExam(id: string): void {
  Swal.fire({
    title: 'Delete Exam?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.examService.deleteExam(id).subscribe({
        next: () => {
          this.toastr.success('Exam deleted');
          this.loadExams();

          Swal.fire({
            title: 'Deleted!',
            text: 'The exam has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err) => {
          this.toastr.error('Delete failed');
          console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong while deleting.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
}


  addingExam = false;  // Add state for showing add modal

   showAddExam(): void {
    this.addingExam = true;
  }

  cancelAdd(): void {
    this.addingExam = false;
  }

  handleAdd(newExam: ExamDetails): void {
    this.examService.addExam(newExam).subscribe({
      next: () => {
        this.toastr.success('Exam added successfully');
        this.addingExam = false;
        this.loadExams();
      },
      error: (err) => {
        this.toastr.error('Failed to add exam');
        console.error(err);
      }
    });
  }
    editingQuestionsFor: ExamDetails | null = null;

   openQuestionModal(exam: ExamDetails) {
    this.editingQuestionsFor = exam;
  }

  closeQuestionModal() {
    this.editingQuestionsFor = null;
    this.loadExams();
  }
  viewingQuestionsFor: ExamDetails | null = null;

viewQuestions(exam: ExamDetails) {
  this.viewingQuestionsFor = exam;
}

closeQuestionsView() {
  this.viewingQuestionsFor = null;
}
viewingScoresFor: ExamDetails | null = null;

viewScores(exam: ExamDetails) {
  this.viewingScoresFor = exam;
}

closeScoresView() {
  this.viewingScoresFor = null;
}

}
