import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, tap, catchError, of } from 'rxjs';
import { Store } from './store';
import { Course } from './Interfaces/Course';
import { RegistrationDto, RegistrationModel } from './Interfaces/Registration';
import { MatSnackBar } from '@angular/material/snack-bar';

const API_BASE_URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root',
})
export class Backend {
  private http = inject(HttpClient);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  // Helper-Methode für SnackBar-Nachrichten
  private showSnackBar(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Schließen', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  public loadInitialData() {
    this.store.isLoading.set(true);
    forkJoin({
      courses: this.http.get<Course[]>(`${API_BASE_URL}/courses?_expand=eventLocation`),
      registrations: this.http.get<RegistrationDto[]>(`${API_BASE_URL}/registrations?_expand=course`)
    }).subscribe({
      next: (data) => {
        this.store.courses = data.courses;
        this.store.registrations = data.registrations;
        this.store.isLoading.set(false);
      },
      error: () => {
        this.store.isLoading.set(false);
        this.showSnackBar('Fehler beim Laden der Daten. Bitte versuchen Sie es erneut.', 5000);
      }
    });
  }

  public getCourses() {
    this.http
      .get<Course[]>(`${API_BASE_URL}/courses?_expand=eventLocation`)
      .subscribe({
        next: (data) => {
          this.store.courses = data;
        },
        error: () => {
          this.showSnackBar('Fehler beim Laden der Kurse.');
        }
      });
  }

  public getRegistrations() {
    this.http
      .get<RegistrationDto[]>(`${API_BASE_URL}/registrations?_expand=course`)
      .subscribe({
        next: (data) => {
          this.store.registrations = data;
        },
        error: () => {
          this.showSnackBar('Fehler beim Laden der Anmeldungen.');
        }
      });
  }

  public addRegistration(registration: RegistrationModel) {
    this.http.post(`${API_BASE_URL}/registrations`, registration).subscribe({
      next: () => {
        this.getRegistrations();
        this.showSnackBar('Anmeldung erfolgreich hinzugefügt!');
      },
      error: () => {
        this.showSnackBar('Fehler beim Hinzufügen der Anmeldung. Bitte versuchen Sie es erneut.', 5000);
      }
    });
  }

  public deleteRegistration(registrationId: string): Observable<any> {
    return this.http.delete(`${API_BASE_URL}/registrations/${registrationId}`).pipe(
      tap(() => {
        this.getRegistrations();
        this.showSnackBar('Anmeldung erfolgreich gelöscht!');
      }),
      catchError(() => {
        this.showSnackBar('Fehler beim Löschen der Anmeldung. Bitte versuchen Sie es erneut.', 5000);
        return of(null);
      })
    );
  }
}
