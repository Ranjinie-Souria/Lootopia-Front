import { Component, inject } from '@angular/core';
import { RoutePaths } from '../../../config/route-paths';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ResendEmailFormComponent } from "./resend-email-form.component";
import { PasswordService } from '../../../services/password.service';
import { BtnComponent } from "../../../shared/components/btn/btn.component";

@Component({
  selector: 'app-password-reset',
  imports: [ReactiveFormsModule, ResendEmailFormComponent, BtnComponent],
  templateUrl: './resend-email.component.html',
  styleUrl: '../login.component.scss'
})
export class ResendEmailComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private passService = inject(PasswordService);
  protected route = inject(ActivatedRoute);
  protected readonly RoutePaths = RoutePaths;
  protected isTokenRoute: boolean = false;
  protected isTokenValid: boolean = false;
  protected durationBeforeRedirection = 1000 * 5; // Seconds
  protected error: string = '';
  protected success: boolean = false;
  protected token: string = '';

  protected form = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,100}$/,
          ),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,100}$/,
          ),
        ],
      ],
    },
    {
      validators: this.passwordsMatchValidator,
    },
  );

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.isTokenRoute = true;
        this.token = token;
      }
    });
  }

  protected submitNewPassword() {
    if (this.form.invalid) {
      this.form.markAsDirty();
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.value.password;

    this.passService.editPassword(password, this.token).subscribe({
      next: () => {
        this.success = true;
        this.redirect(this.durationBeforeRedirection);
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  private handleError(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.form.markAsDirty();
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

  private redirect(durationBeforeRedirection: number) : void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, durationBeforeRedirection);
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  }
}
