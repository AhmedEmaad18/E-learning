import { Component, EventEmitter, Output } from '@angular/core';
import { ExamDetails } from '../../../../core/models/model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-exam',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css'
})
export class AddExamComponent {
 @Output() save = new EventEmitter<ExamDetails>();
  @Output() cancel = new EventEmitter<void>();
minDate = new Date().toISOString().split('T')[0]; // today's date yyyy-mm-dd format

  exam: Partial<ExamDetails> = {
    title: '',
    description: '',
    duration: 30,
    classLevel: '',
    isPublished: false,
    startDate: '',
    endDate: ''
  };


 onSubmit() {
  Swal.fire({
    title: 'Add Exam?',
    text: 'Are you sure you want to add this exam?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, add it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.save.emit(this.exam as ExamDetails);

      Swal.fire({
        title: 'Success!',
        text: 'Exam has been added.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  });
}

}
