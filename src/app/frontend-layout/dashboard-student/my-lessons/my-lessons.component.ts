import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment.service';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Lesson } from '../../../core/models/model';

@Component({
  selector: 'app-my-lessons',
  imports: [NgClass, RouterLink],
  templateUrl: './my-lessons.component.html',
  styleUrl: './my-lessons.component.css',
})
export class MyLessonsComponent {
  isLoading: boolean = true;
  purchasedLessons: Lesson[] = [];
  filteredLessons: Lesson[] = [];
  selectedLevel: string = '';

  constructor(private _PaymentService: PaymentService) {}

  getPurchasedLessons(): void {
    this._PaymentService.getPurchasedLessons().subscribe({
      next: (res) => {
        this.purchasedLessons = res;
        this.filteredLessons = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching purchased lessons:', err);
      },
    });
  }

  applyFilters() {
    this.filteredLessons = this.purchasedLessons.filter((lesson) => {
      const levelMatch = this.selectedLevel
        ? lesson.classLevel === this.selectedLevel
        : true;
      return levelMatch;
    });
  }

  toggleLevelFilter(event: Event) {
    this.selectedLevel = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  ngOnInit(): void {
    this.getPurchasedLessons();
  }
}
