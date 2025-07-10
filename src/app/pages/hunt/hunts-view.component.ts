import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { HuntInformationViewDTO } from '../../model/hunt-information-view.dto';
import { HuntsService } from '../../services/hunt.service';
import { CommonModule } from '@angular/common';
import { PageDTO } from '../../model/page.dto';

@Component({
  selector: 'app-hunts-view',
  templateUrl: './hunts-view.component.html',
  styleUrls: ['./hunt.component.scss'],
  imports: [CommonModule],
})
export class HuntsViewComponent implements OnInit {

  hunts!: PageDTO<HuntInformationViewDTO>;
  page = 0;
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
        console.debug('Hunts loaded:', this.hunts);
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

  goToHuntDetails(idHunt: string) {
    throw new Error('Method not implemented.');
  }

}
