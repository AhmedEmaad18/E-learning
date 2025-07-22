import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../../core/services/exam.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css'],
})
export class ExamResultComponent  {
    score: number;
  totalPoints: number;
  constructor(
    public dialogRef: MatDialogRef<ExamResultComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.score = data.score;
    this.totalPoints = data.totalPoints;
  }
  get percentage(): number {
    return this.totalPoints ? (this.score / this.totalPoints) * 100 : 0;
  }
  close() {
    this.dialogRef.close();
  }
}
