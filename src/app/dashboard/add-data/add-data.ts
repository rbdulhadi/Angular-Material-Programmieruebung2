import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Store } from '../../shared/store';
import { Backend } from '../../shared/backend';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

// Custom Validator für Geburtsdatum (Alter zwischen 15 und 40 Jahren)
function birthdateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // Required-Validator kümmert sich darum
  }

  const selectedDate = new Date(control.value);
  const today = new Date();
  
  // Maximales Geburtsdatum: heute - 15 Jahre (mindestens 15 Jahre alt)
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 15);
  
  // Minimales Geburtsdatum: heute - 40 Jahre (maximal 40 Jahre alt)
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 40);

  if (selectedDate > today) {
    return { futureDate: true };
  }

  if (selectedDate > maxDate) {
    return { tooYoung: true };
  }

  if (selectedDate < minDate) {
    return { tooOld: true };
  }

  return null;
}

@Component({
  selector: 'app-add-data',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './add-data.html',
  styleUrl: './add-data.scss',
})
export class AddData {
  public store = inject(Store);
  public backend = inject(Backend);
  private fb = inject(FormBuilder);
  public signupForm!: FormGroup;

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required, birthdateValidator]],
      email: ['', [Validators.required, Validators.email]],
      newsletter: [false],
      courseId: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.backend.addRegistration(this.signupForm.value);
      this.signupForm.reset();
      this.signupForm.patchValue({ newsletter: false });
    } else {
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Dieses Feld ist erforderlich';
    }
    if (control?.hasError('email')) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    if (control?.hasError('minlength')) {
      return `Mindestens ${control.errors?.['minlength'].requiredLength} Zeichen erforderlich`;
    }
    if (control?.hasError('futureDate')) {
      return 'Das Geburtsdatum darf nicht in der Zukunft liegen';
    }
    if (control?.hasError('tooYoung')) {
      return 'Sie müssen mindestens 15 Jahre alt sein';
    }
    if (control?.hasError('tooOld')) {
      return 'Sie dürfen maximal 40 Jahre alt sein';
    }
    return '';
  }
}
