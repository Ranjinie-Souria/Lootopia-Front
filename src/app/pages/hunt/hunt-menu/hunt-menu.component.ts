import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'app-hunt-menu',
  imports: [],
  templateUrl: './hunt-menu.component.html',
  styleUrl: '../hunt.component.scss',
})
export class HuntMenuComponent {
  private readonly router = inject(Router);

  navigateToCreatedHunts(): void {
    this.router.navigate([RoutePaths.HUNT]);
  }

  navigateToInvites(): void {
    this.router.navigate([RoutePaths.HUNT_INVITES]);
  }

  navigateToParticipatingHunts(): void {
    this.router.navigate([RoutePaths.HUNT_PARTICIPATING]);
  }
}
