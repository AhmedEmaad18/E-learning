import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Lesson } from '../../../core/models/model';
import { LessonService } from '../../../core/services/lesson.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [NgClass, RouterLink,CommonModule],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  isLoading = true;
  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  purchasedLessonIds: string[] = [];

  selectedLevel = '';
  isLessonsFree = false;
trackLesson(index: number, lesson: Lesson): string {
  return lesson._id;
}

  constructor(
    private lessonService: LessonService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLessons();
    this.fetchPurchasedLessons();
  }

  private fetchLessons(): void {
    this.lessonService.getAllLessons().subscribe({
      next: (res) => {
        this.lessons = res.data;
        this.filteredLessons = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.isLoading = false;
      },
    });
  }

  private fetchPurchasedLessons(): void {
    this.paymentService.getPurchasedLessons().subscribe({
      next: (res) => {
        this.purchasedLessonIds = res.map((l: any) => l._id);
      },
      error: (err) => {
        console.error('Error loading purchased lessons:', err);
      },
    });
  }

  isPurchased(lessonId: string): boolean {
    return this.purchasedLessonIds.includes(lessonId);
  }

  applyFilters(): void {
    this.filteredLessons = this.lessons.filter((lesson) => {
      const levelMatches = this.selectedLevel
        ? lesson.classLevel === this.selectedLevel
        : true;
      const freeMatches = this.isLessonsFree ? !lesson.isPaid : true;
      return levelMatches && freeMatches;
    });
  }

  toggleFreeOnly(event: Event): void {
    this.isLessonsFree = (event.target as HTMLInputElement).checked;
    this.applyFilters();
  }

  toggleLevelFilter(event: Event): void {
    this.selectedLevel = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  payment(lesson: Lesson): void {
    this.paymentService.payment(lesson._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/student/pay'], {
            state: { price: lesson.price, title: lesson.title },
          });
        }
      },
      error: (err) => console.error('Payment error:', err),
    });
  }
}
