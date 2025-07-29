import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../../core/models/model';
import { LessonService } from '../../../core/services/lesson.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-lesson-list',
  imports: [NgClass, RouterLink],
  templateUrl: './lesson-list.component.html',
  styleUrl: './lesson-list.component.css',
})
export class LessonListComponent {
  isLoading: boolean = true;

  lessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  purchasedLessonIds: string[] = [];

  selectedLevel: string = '';
  isLessonsFree: boolean = false;

  constructor(
    private _LessonService: LessonService,
    private _PaymentService: PaymentService
  ) {}

  getALlLessons(): void {
    this._LessonService.getAllLessons().subscribe({
      next: (res) => {
        this.lessons = res.data;
        this.filteredLessons = res.data;
        this.isLoading = false;
        
        console.log(res.data)
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
      },
    });
  }

  getPurchasedLessons(): void {
    this._PaymentService.getPurchasedLessons().subscribe({
      next: (res) => {
        this.purchasedLessonIds = res.map((l: any) => l?._id);
      },
      error: (err) => {
        console.error('Error loading purchased lessons:', err);
      },
    });
  }

  isPurchased(lessonId: string): boolean {
    return this.purchasedLessonIds.includes(lessonId);
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

  payment(lessonId: string): void {
    this._PaymentService.payment(lessonId).subscribe({
      next: (res) => {
        if (res.success && res.paymentUrl) {
          location.href = res.paymentUrl;
        }
      },
      error: (err) => {
        console.error('Payment error:', err);
      },
    });
  }

  ngOnInit(): void {
    this.getALlLessons();
    this.getPurchasedLessons();
  }
}
