import { Component } from '@angular/core';
import { Lesson } from '../../../core/models/model';
import { LessonService } from '../../../core/services/lesson.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-lessons',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './manage-lessons.component.html',
  styleUrl: './manage-lessons.component.css',
})
export class ManageLessonsComponent {
  isLoading: boolean = true;
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  purchasedLessonIds: string[] = [];

  selectedLevel: string = '';
  isLessonsFree: boolean = false;
  showModal = false;
  lessonForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _LessonService: LessonService,
    private router: Router,
    private _PaymentService: PaymentService
  ) {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      classLevel: ['', Validators.required],
      isPaid: [false],
      price: [0],
    });

    this.lessonForm.get('isPaid')?.valueChanges.subscribe((paid) => {
      if (!paid) this.lessonForm.get('price')?.setValue(0);
    });
  }

  getALlLessons(): void {
    this._LessonService.getAllLessons().subscribe({
      next: (res) => {
        this.lessons = res.data;
        this.filteredLessons = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
      },
    });
  }

 deleteLesson(lessonId: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This lesson will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      // 🔁 Call your delete API or service here
      this._LessonService.deleteLesson(lessonId).subscribe(() => {
        Swal.fire('Deleted!', 'The lesson has been removed.', 'success');
        this.getALlLessons(); // reload list
      });
    }
  });
}


  onEditLesson(lesson: Lesson) {
    localStorage.setItem('selectedLesson', JSON.stringify(lesson));
    this.router.navigate(['admin/lessons/edit']);
  }

  applyFilters() {
    this.filteredLessons = this.lessons.filter((lesson) => {
      const levelMatch = this.selectedLevel
        ? lesson.classLevel === this.selectedLevel
        : true;
      const freeMatch = this.isLessonsFree ? !lesson.isPaid : true;
      return levelMatch && freeMatch;
    });
  }

  toggleFreeOnly(event: Event) {
    this.isLessonsFree = (event.target as HTMLInputElement).checked;
    this.applyFilters();
  }

  toggleLevelFilter(event: Event) {
    this.selectedLevel = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  ngOnInit(): void {
    this.getALlLessons();
  }

}
