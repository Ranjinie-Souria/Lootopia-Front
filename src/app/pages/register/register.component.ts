import { Component, inject } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { RoutePaths } from '../../config/route-paths';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RegisterRequest, RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  imports: [BtnComponent, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);

  protected readonly RoutePaths = RoutePaths;
  protected form = this.fb.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
  protected registrationError: string = '';

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const payload: RegisterRequest = {
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    this.registerService.register(payload).subscribe({
      next: () => this.handleRegistrationSuccess(),
      error: (err) => this.handleRegistrationError(err),
    });
  }

  private handleRegistrationError(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.registrationError = 'This email address is already in use.';
    if (err.status === 409) {
      this.registrationError =
        'This username or email address is already in use.';
    } else if (err.status === 400) {
      this.registrationError =
        'Error during registration. Please check the entered information.';
    } else if (err.status === 500) {
      this.registrationError = 'Internal server error. Please try again later.';
    }
    return;
  }

  private handleRegistrationSuccess(): void {
    this.router.navigate([RoutePaths.REGISTER_SUCCESS], {
      state: { fromRegister: true },
    });
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  }
}
