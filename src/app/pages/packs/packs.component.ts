import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PackService } from '../../services/pack.service';
import { Observable } from 'rxjs';
import { PackDto } from '../../model/pack.dto';
import { PageDTO } from '../../model/page.dto';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-packs',
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent],
  templateUrl: './packs.component.html',
  styleUrl: './packs.component.scss',
})
export class PacksComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly packService = inject(PackService);
  packs!: PageDTO<PackDto>;
  page = 0;
  loading = true;
  error = '';
  currentPage = 0;
  totalPages = 0;

  addToCart(pack: any) {
    const cartCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cart='));
    let cart: any[] = cartCookie
      ? JSON.parse(decodeURIComponent(cartCookie.split('=')[1]))
      : [];
    cart.push(pack);
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(cart))}; path=/`;
    console.log('Pack added to cart:', pack);

    console.log('Current cart:', cart);
  }

  ngOnInit() {
    this.packService
      .getPacks(
        this.page.toString(),
        '2', // Default page size
      )
      .subscribe({
        next: (data) => {
          this.totalPages = data.totalPages;
          this.currentPage = data.pageNumber;
          this.packs = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load your hunts.';
          this.loading = false;
        },
      });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loading = true;
      this.packService
        .getPacks(
          this.currentPage.toString(),
          '2', // Default page size
        )
        .subscribe({
          next: (data) => {
            this.packs = data;
            this.loading = false;
          },
          error: () => {
            this.error = 'Unable to load your packs.';
            this.loading = false;
          },
        });
    }
  }
}
