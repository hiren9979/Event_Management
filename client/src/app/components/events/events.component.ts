import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { EventService } from '../../services/event.service';
import type { Event as EventModel } from '../../services/event.service';
import { EventFormComponent } from './event-form.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'date', 'type', 'actions'];
  dataSource: MatTableDataSource<EventModel>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadEvents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.dataSource.data = events;
      },
      error: (error) => {
        this.showSnackBar('Error loading events');
        console.error('Error loading events:', error);
      }
    });
  }

  openEventDialog(event?: EventModel) {
    const dialogRef = this.dialog.open(EventFormComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: event,
      panelClass: ['event-dialog', 'mat-elevation-z8'],
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
        this.showSnackBar(event ? 'Event updated successfully' : 'Event created successfully');
      }
    });
  }

  deleteEvent(event: EventModel) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(event.id!).subscribe({
        next: () => {
          this.loadEvents();
          this.showSnackBar('Event deleted successfully');
        },
        error: (error) => {
          this.showSnackBar('Error deleting event');
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
