// src/app/services/stripe.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  stripe: any = null;

  constructor() {
    // @ts-ignore
    this.stripe = Stripe(
      'stripe.public.key=pk_test_51RjTpLCTzRaLgZr0bIeDHW1Z8qHKBjJ8lfPFI9Yym9bSJOe5oiett8S8seA6UEVyIxfXDvwDdmBKbeVfYxWM0o0Q00yE4vRDhg',
    );
  }

  redirectToCheckout(sessionId: string) {
    if (!this.stripe) return;

    this.stripe.redirectToCheckout({ sessionId }).then((result: any) => {
      if (result.error) {
        console.error(result.error.message);
      }
    });
  }
}
