import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-my-scores',
  imports: [],
  templateUrl: './my-scores.component.html',
  styleUrl: './my-scores.component.css'
})
export class MyScoresComponent implements OnInit {
 averageScore: string | number = '-';
  constructor(private scoreService: ExamService) {}

  ngOnInit() {
    this.scoreService.averageScore$.subscribe(score => {
      this.averageScore = score;
    });
  }
}
