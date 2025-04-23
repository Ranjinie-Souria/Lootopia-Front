import { Component, inject } from '@angular/core';
import { RoutePaths } from '../../../config/route-paths';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, BtnComponent],
  templateUrl: './resend-email.component.html',
  styleUrl: '../login.component.scss'
})
export class ResendEmailComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registerService = inject(RegisterService);
  protected readonly RoutePaths = RoutePaths;
  protected error: string = '';
  protected success: boolean = false;

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected resendEmail() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email: string = this.form.value.email || '';

    this.registerService.resendValidateEmail(email).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate([this.RoutePaths.LOGIN]);
        }, 8000);
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  private handleError(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.error = 'Error, the email you entered was not found. It is possible that you have not registered yet or that your account is already verified.';
    if (err.status === 409) {
      this.error = 'Error, the email you entered was not found. It is possible that you have not registered yet or that your account is already verified.';
    } else if (err.status === 400) {
      this.error =
        'Error during the sending process to the email. Please check the entered information.';
    } else if (err.status === 500) {
      this.error = 'Internal server error. Please try again later.';
    }
    return;
  }
}
