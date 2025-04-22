import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselSlide } from '../../../../model/carousel-slide';

@Component({
  selector: 'app-sponsored-carousel',
  templateUrl: './sponsored-carousel.component.html',
  styleUrls: ['./sponsored-carousel.component.scss'],
  imports: [CommonModule],
})
export class SponsoredCarouselComponent implements OnInit {
  protected currentIndex: number = 0;
  protected slides: Array<CarouselSlide> = [];

  ngOnInit(): void {
    this.slides = [
      new CarouselSlide(
        1,
        'Chacode',
        'Chacode, the team behind Lootopia',
        'chacode.png',
      ),
      new CarouselSlide(
        2,
        'Release',
        'Lootopia is finally here',
        'lootopia.png',
      ),
    ];

    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}
