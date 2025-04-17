import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { RoutePaths } from '../../config/route-paths';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, BtnComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  protected readonly RoutePaths = RoutePaths;
  protected loginError: string = '';

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.form.value.email || '',
      password: this.form.value.password || ''
    };
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        this.router.navigate([RoutePaths.HOME]);
      },
      error: (err) => {
       this.handleLoginError(err);
      }
    });
  }

  private handleLoginError(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.loginError = 'Error, the email or password you entered are incorrect.';
    if (err.status === 409) {
      this.loginError = 'Error, the email or password you entered are incorrect.';
    } else if (err.status === 400) {
      this.loginError = 'Error during login. Please check the entered information.';
    } else if (err.status === 500) {
      this.loginError = 'Internal server error. Please try again later.';
    }
    return;
  }

}
