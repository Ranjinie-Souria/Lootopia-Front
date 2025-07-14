import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PackDto } from '../../model/pack.dto';
import { PageDTO } from '../../model/page.dto';
import { PackService } from '../../services/pack.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-basket',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly packService = inject(PackService);
  private readonly stripeService = inject(StripeService);
  packs!: PageDTO<PackDto>;
  totalPrice: number = 0;

  ngOnInit() {
    const cartCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cart='));
    let cart: any[] = cartCookie
      ? JSON.parse(decodeURIComponent(cartCookie.split('=')[1]))
      : [];
    this.packs = {
      content: cart,
      totalPages: 1,
      pageNumber: 0,
      pageSize: cart.length,
      total: cart.length,
    };
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.packs.content.reduce((sum, pack) => {
      return sum + (pack.price || 0);
    }, 0);
    console.log('Total Price:', this.totalPrice);
  }

  checkout() {
    console.log('Proceeding to checkout with packs:', this.packs.content);
    const productName = 'CROWN';
    const amount = this.totalPrice;
    const detailedInformation = '';
    const quantity = this.packs.content.length;

    this.packService
      .goToStripeCheckout(productName, amount, detailedInformation, quantity)
      .subscribe(
        (response) => {
          if (response.sessionId) {
            this.stripeService.redirectToCheckout(response.sessionId);
          } else {
            console.error('Failed to create Stripe session:', response);
          }
        },
        (error) => {
          console.error('Error during checkout:', error);
        },
      );
  }
}
