import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, MatRadioModule, MatFormFieldModule, MatInputModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent {
  @Input() question: any;
  @Input() selectedAnswer: string | null = null;
  @Output() answer = new EventEmitter<{ questionId: string; selectedAnswer: string }>();

  selectAnswer(option: string) {
    this.selectedAnswer = option;
    this.answer.emit({ questionId: this.question._id, selectedAnswer: option });
  }
  questionOptions() {
  if (this.question.type === 'true-false') {
    return ['True', 'False'];
  }
  return this.question.options || [];
}

}
