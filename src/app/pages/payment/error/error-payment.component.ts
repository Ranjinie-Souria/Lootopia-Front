import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-payment',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './error-payment.component.html',
  styleUrl: './error-payment.component.scss',
})
export class ErrorPaymentComponent {
  private readonly router = inject(Router);
}
