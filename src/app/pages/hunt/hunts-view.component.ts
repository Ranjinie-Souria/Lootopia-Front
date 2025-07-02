import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { HuntInformationViewDTO } from '../../model/hunt-information-view.dto';
import { HuntsService } from '../../services/hunt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hunts-view',
  templateUrl: './hunts-view.component.html',
  styleUrls: ['./hunt.component.scss'],
  imports: [CommonModule],
})
export class HuntsViewComponent implements OnInit {
  hunts: HuntInformationViewDTO[] = [];
  loading = true;
  error = '';

  constructor(
    private readonly huntsService: HuntsService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.huntsService.getMyHunts().subscribe({
      next: (data) => {
        this.hunts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load your hunts.';
        this.loading = false;
      },
    });
  }

  goToCreateHunt(): void {
    this.router.navigate([RoutePaths.HUNT_CREATE]);
  }
}
