import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.scss',
})
export class SuccessPaymentComponent {
  private readonly router = inject(Router);
}
