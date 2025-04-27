import { Component, inject } from '@angular/core';
import { RoutePaths } from '../../../config/route-paths';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { PasswordService } from '../../../services/password.service';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, BtnComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: '../login.component.scss'
})
export class PasswordResetComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private passService = inject(PasswordService);
  protected readonly RoutePaths = RoutePaths;
  protected resetPassError: string = '';
  protected success: boolean = false;

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected resetPass() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const email: string = this.form.value.email || '';

    this.passService.resetPassword(email).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate([this.RoutePaths.LOGIN]);
        }, 8000);
      },
      error: (err) => {
        this.handlePassError(err);
      },
    });
  }

  private handlePassError(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.resetPassError = 'Error, the email you entered is incorrect.';
    if (err.status === 409) {
      this.resetPassError =
        'Error, the email you entered is incorrect.';
    } else if (err.status === 400) {
      this.resetPassError =
        'Error during the sending process to the email. Please check the entered information.';
    } else if (err.status === 500) {
      this.resetPassError = 'Internal server error. Please try again later.';
    }
    return;
  }
}
