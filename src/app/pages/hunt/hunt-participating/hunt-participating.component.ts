import { Component, inject, OnInit } from '@angular/core';
import { HuntMenuComponent } from '../hunt-menu/hunt-menu.component';
import { HuntsService } from '../../../services/hunt.service';
import { PageDTO } from '../../../model/page.dto';
import { CommonModule } from '@angular/common';
import { HuntDto } from '../../../model/hunt.dto';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'app-hunt-participating',
  imports: [HuntMenuComponent, CommonModule, LoaderComponent],
  templateUrl: './hunt-participating.component.html',
  styleUrl: '../hunt.component.scss',
})
export class HuntParticipatingComponent implements OnInit {
  error: any;
  private huntService = inject(HuntsService);
  protected participatingHunts: PageDTO<HuntDto> | null = null;
  loading: any;
  private router = inject(Router);

  ngOnInit(): void {
    this.huntService.getMyParticipatingHunts().subscribe({
      next: (val) => {
        this.participatingHunts = val;
      },
      error: (err) => {},
    });
  }

  play(participatingHunt: string) {
    this.router.navigate([RoutePaths.GAME], {
      queryParams: { huntId: participatingHunt },
    });
  }
}
