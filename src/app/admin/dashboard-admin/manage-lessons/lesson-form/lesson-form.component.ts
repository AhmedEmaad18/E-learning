import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../../../../core/services/lesson.service';

@Component({
  selector: 'app-lesson-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './lesson-form.component.html',
  styleUrl: './lesson-form.component.css',
})
export class LessonFormComponent implements OnInit {
  lessonForm!: FormGroup;
  lessonId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      scheduledDate: ['', Validators.required],
      classLevel: ['', Validators.required],
    });
    const storedLesson = localStorage.getItem('selectedLesson');
    if (storedLesson) {
      this.isEditMode = true;
      const lesson = JSON.parse(storedLesson);
      this.lessonId = lesson._id;
      this.lessonForm.patchValue({
        title: lesson.title,
        description: lesson.description,
        video: lesson.video,
        price: lesson.price,
        scheduledDate: lesson.scheduledDate
          ? lesson.scheduledDate.split('T')[0]
          : '',
        classLevel: lesson.classLevel,
      });
      localStorage.removeItem('selectedLesson');
    }
  }

  onSubmit() {
    if (this.lessonForm.invalid) return;
    const data = { ...this.lessonForm.value };

    if (this.isEditMode && this.lessonId) {
      delete data.scheduledDate;

      this.lessonService.updateLesson(this.lessonId, data).subscribe({
        next: () => {
          alert('Lesson updated successfully!');
          localStorage.removeItem('selectedLesson');
          this.router.navigate(['/admin/manage-lessons']);
        },
        error: (err) => {
          alert('Failed to update lesson.');
          console.log(err);
        },
      });
    } else {
      this.lessonService.addLesson(data).subscribe({
        next: () => {
          alert('Lesson added successfully!');
          this.router.navigate(['/admin/manage-lessons']);
        },
        error: (err) => {
          alert('Failed to add lesson.');
          console.log(err);
        },
      });
    }
  }
}
