import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuestionService } from '../../../../../core/services/question.service';
import Swal from 'sweetalert2';

export interface Question {
  _id?: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  points: number;
  exam: string;
  options?: string[];
  correctAnswer?: string | string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

@Component({
  selector: 'app-editquestion',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './editquestion.component.html',
  styleUrls: ['./editquestion.component.css'],
})
export class EditquestionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() question!: Question;
  @Output() close = new EventEmitter<void>();
  @Output() questionUpdated = new EventEmitter<Question>();

  form: FormGroup;
  private optionsSub?: Subscription;

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.form = this.fb.group({
      text: ['', Validators.required],
      type: ['', Validators.required],
      points: [0, [Validators.required, Validators.min(0)]],
      options: this.fb.array([]),
      correctAnswer: ['', Validators.required],
    });
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  ngOnInit() {
    this.subscribeToOptionsChanges();
  }

  ngOnDestroy() {
    this.unsubscribeFromOptionsChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['question'] && this.question) {
      this.loadQuestionIntoForm();
    }
  }

  private subscribeToOptionsChanges() {
    this.optionsSub = this.options.valueChanges.subscribe((opts: string[]) => {
      const correct = this.form.get('correctAnswer')?.value;
      if (!opts.includes(correct)) {
        this.form.get('correctAnswer')?.setValue(opts[0] || '', { emitEvent: false });
      }
    });
  }

  private unsubscribeFromOptionsChanges() {
    this.optionsSub?.unsubscribe();
  }
@Input() formKey!: number;  // new input to force reactive rebuild

  private loadQuestionIntoForm() {
    this.options.clear();

    if (this.question.type === 'true-false') {
      this.options.push(this.fb.control('True'));
      this.options.push(this.fb.control('False'));
      this.form.get('correctAnswer')?.setValue(
        this.question.correctAnswer === 'False' ? 'False' : 'True',
        { emitEvent: false }
      );
    } else if (this.question.type === 'multiple-choice' && this.question.options?.length) {
      this.question.options.forEach(opt =>
        this.options.push(this.fb.control(opt, Validators.required))
      );
      const correct = this.question.correctAnswer;
      if (typeof correct === 'string' && this.question.options.includes(correct)) {
        this.form.get('correctAnswer')?.setValue(correct, { emitEvent: false });
      } else {
        this.form.get('correctAnswer')?.setValue(this.question.options[0], { emitEvent: false });
      }
    } else {
      // short-answer or others
      this.options.clear();
      this.form.get('correctAnswer')?.setValue(this.question.correctAnswer || '', { emitEvent: false });
    }

    this.form.patchValue({
      text: this.question.text || '',
      type: this.question.type || '',
      points: this.question.points ?? 0,
    }, { emitEvent: false });
  }

  onTypeChange() {
    const type = this.form.get('type')?.value;
    this.options.clear();

    if (type === 'multiple-choice') {
      this.options.push(this.fb.control('', Validators.required));
      this.options.push(this.fb.control('', Validators.required));
      this.form.get('correctAnswer')?.setValue(this.options.at(0)?.value || '', { emitEvent: false });
    } else if (type === 'true-false') {
      this.options.push(this.fb.control('True'));
      this.options.push(this.fb.control('False'));
      this.form.get('correctAnswer')?.setValue('True', { emitEvent: false });
    } else {
      this.form.get('correctAnswer')?.setValue('', { emitEvent: false });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      console.log('Form invalid:', this.form.value);
      return;
    }
    if (!this.question._id) {
      console.error('No question ID');
      return;
    }

    const formValue = this.form.value;

    const payload: any = {
      text: formValue.text,
      type: formValue.type,
      points: formValue.points,
      correctAnswer: formValue.correctAnswer,
      exam: this.question.exam,
    };

    if (formValue.type === 'multiple-choice') {
      payload.options = formValue.options?.filter((opt: string) => opt.trim() !== '') || [];
    }

    console.log('Updating question with payload:', payload);

    this.questionService.updateQuestion(this.question._id, payload).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.question = res.data;
          this.loadQuestionIntoForm();
          this.questionUpdated.emit(this.question);
          Swal.fire({
            icon: 'success',
            title: 'Question Updated',
            timer: 1500,
            showConfirmButton: false,
          });
          this.close.emit();
        } else {
          Swal.fire('Error', 'Update failed: No data returned', 'error');
        }
      },
      error: (err) => {
        console.error('Update error:', err);
        Swal.fire('Error', 'Failed to update question', 'error');
      },
    });
  }

  onCancel() {
    this.loadQuestionIntoForm();
    this.close.emit();
  }
}
