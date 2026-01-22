import { Component, inject, Inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Dialog Component
@Component({
  selector: 'confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Anmeldung löschen</h2>
    <mat-dialog-content>
      <p>Möchten Sie diese Anmeldung wirklich löschen?</p>
      <p class="warning-text">Diese Aktion kann nicht rückgängig gemacht werden.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Abbrechen</button>
      <button mat-raised-button color="warn" (click)="onYesClick()">Löschen</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning-text {
      color: #f44336;
      font-weight: 500;
      margin-top: 0.5rem;
    }
  `],
  imports: [MatDialogModule, MatButtonModule],
  standalone: true
})
export class ConfirmDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-data',
  imports: [DatePipe, MatButtonModule, MatDialogModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './data.html',
  styleUrl: './data.scss',
})
export class Data {
  public store = inject(Store);
  private backendService = inject(Backend);
  private dialog = inject(MatDialog);

  // Pagination State
  public pageSize = 5;
  public currentPage = signal(0);
  public pageSizeOptions = [5];

  // Loading State für einzelne Anmeldungen (Set mit IDs)
  public deletingRegistrations = signal<Set<string>>(new Set());

  // Getter: Paginierte Anmeldungen (wird bei jedem Change Detection neu berechnet)
  get paginatedRegistrations() {
    const startIndex = this.currentPage() * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.store.registrations.slice(startIndex, endIndex);
  }

  // Getter: Gesamtanzahl der Anmeldungen
  get totalRegistrations() {
    return this.store.registrations.length;
  }

  // Getter: Soll Pagination angezeigt werden?
  get showPagination() {
    return this.totalRegistrations > this.pageSize;
  }

  // Getter: Gesamtanzahl der Seiten
  get totalPages() {
    return Math.ceil(this.totalRegistrations / this.pageSize);
  }

  // Getter: Aktuelle Seitenzahl (1-basiert)
  get currentPageNumber() {
    return this.currentPage() + 1;
  }

  constructor() {
    // Effect: Aktualisiere Seite wenn sich die Daten ändern
    effect(() => {
      // Zugriff auf store.registrations.length triggert Change Detection
      const total = this.store.registrations.length;
      const currentPageIndex = this.currentPage();
      const maxPageIndex = Math.max(0, Math.ceil(total / this.pageSize) - 1);

      // Wenn die aktuelle Seite nicht mehr existiert (z.B. nach Löschung), gehe zur letzten gültigen Seite
      if (currentPageIndex > maxPageIndex && maxPageIndex >= 0) {
        this.currentPage.set(maxPageIndex);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize = event.pageSize;
  }

  deleteRegistration(id: string) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.setDeletingState(id, true);

        this.backendService.deleteRegistration(id).subscribe({
          next: () => this.setDeletingState(id, false),
          error: () => this.setDeletingState(id, false)
        });
      }
    });
  }

  private setDeletingState(id: string, isDeleting: boolean): void {
    const currentDeleting = new Set(this.deletingRegistrations());
    if (isDeleting) {
      currentDeleting.add(id);
    } else {
      currentDeleting.delete(id);
    }
    this.deletingRegistrations.set(currentDeleting);
  }

  isDeleting(id: string): boolean {
    return this.deletingRegistrations().has(id);
  }
}
