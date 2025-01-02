import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService, Event as EventModel, EventType } from '../../services/event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  eventForm: FormGroup;
  isSubmitting = false;
  eventTypes: EventType[] = ['Conference', 'Workshop', 'Meetup'];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventModel
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      date: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });

    if (data) {
      this.eventForm.patchValue({
        name: data.name,
        description: data.description,
        date: new Date(data.date),
        type: data.type
      });
    }
  }

  onSubmit() {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.eventForm.value;
      
      // Format date to YYYY-MM-DD
      const date = new Date(formValue.date);
      const formattedDate = date.toISOString().split('T')[0];
      
      const eventData = {
        ...formValue,
        date: formattedDate
      };

      const request = this.data
        ? this.eventService.updateEvent(this.data.id!, eventData)
        : this.eventService.createEvent(eventData);

      request.subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving event:', error);
          this.snackBar.open(
            'Error saving event. Please try again.',
            'Close',
            { duration: 3000 }
          );
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
