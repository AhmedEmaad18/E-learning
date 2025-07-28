import { Component, Input } from '@angular/core';
import { ManageexamService } from '../../../../core/services/manageexam.service';
import { ExamDetails, ExamScore } from '../../../../core/models/model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-examscore',
  imports: [CommonModule],
  templateUrl: './examscore.component.html',
  styleUrl: './examscore.component.css'
})
export class ExamscoreComponent {
@Input() exam!: ExamDetails;
  scores: ExamScore[] = [];
  loading = false;

  constructor(private examService: ManageexamService) {}

  ngOnInit(): void {
    this.loadScores();
  }

  loadScores(): void {
    this.loading = true;
            console.log(this.exam._id)

    this.examService.getScoresByExamId(this.exam._id).subscribe({

      next: (res) => {
        this.scores = res.data;
        console.log(this.scores)
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load scores', err);
        this.loading = false;
      }
    });
  }

}
