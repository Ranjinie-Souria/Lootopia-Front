import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PackDto } from '../../model/pack.dto';
import { PageDTO } from '../../model/page.dto';

@Component({
  selector: 'app-basket',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent implements OnInit {
  private readonly router = inject(Router);
  packs!: PageDTO<PackDto>;

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
  }

  checkout() {
    // Implement checkout logic here
    console.log('Proceeding to checkout with packs:', this.packs.content);
    // Redirect to stripe checkout page or perform any other action
  }
}
