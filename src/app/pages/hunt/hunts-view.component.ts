import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { HuntInformationViewDTO } from '../../model/hunt-information-view.dto';
import { HuntsService } from '../../services/hunt.service';
import { CommonModule } from '@angular/common';
import { PageDTO } from '../../model/page.dto';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { HuntMenuComponent } from './hunt-menu/hunt-menu.component';

@Component({
  selector: 'app-hunts-view',
  templateUrl: './hunts-view.component.html',
  styleUrls: ['./hunt.component.scss'],
  imports: [CommonModule, LoaderComponent, HuntMenuComponent],
})
export class HuntsViewComponent implements OnInit {
  hunts!: PageDTO<HuntInformationViewDTO>;
  page = 0;
  loading = true;
  error = '';
  showDetail: boolean[] = [];
  private huntsService = inject(HuntsService);

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.huntsService.getMyHunts().subscribe({
      next: (data) => {
        this.hunts = data;
        this.loading = false;
        this.showDetail = this.hunts.content.map(() => false);
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

  editHunt(idHunt: string) {
    this.router.navigate([RoutePaths.HUNT_UPDATE, idHunt]);
  }

  toggleDetail(index: number) {
    this.showDetail[index] = !this.showDetail[index];
  }
}
