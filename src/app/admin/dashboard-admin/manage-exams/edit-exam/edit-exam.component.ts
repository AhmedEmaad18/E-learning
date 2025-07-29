import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.css'],
})
export class EditExamComponent {
  @Input() exam: any;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  async onSave() {
    try {
      // Show SweetAlert success popup
      const result = await Swal.fire({
        title: 'Save Exam?',
        text: "Are you sure you want to save changes?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });

      if (result.isConfirmed) {
        // Show loading while saving (optional)
        Swal.fire({
          title: 'Saving...',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });

        // Simulate async save delay (optional)
        await new Promise((r) => setTimeout(r, 1000));

        // Close loading
        Swal.close();

        // Emit save event
        this.save.emit(this.exam);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Your exam was saved successfully.',
          timer: 1800,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Save failed:', error);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
