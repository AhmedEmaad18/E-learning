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

  deleteLesson(id: string) {
    if (confirm('Are you sure you want to delete this lesson?')) {
      this._LessonService.deleteLesson(id).subscribe({
        next: () => this.getALlLessons(),
        error: (err) => console.error('Error deleting lesson:', err),
      });
    }
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
