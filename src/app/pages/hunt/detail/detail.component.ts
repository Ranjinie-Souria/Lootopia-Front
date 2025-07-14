import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { HuntsService } from '../../../services/hunt.service';
import { HuntInformationViewDTO } from '../../../model/hunt-information-view.dto';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hunt-details',
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class HuntDetailsComponent implements OnInit {
  hunt?: HuntInformationViewDTO;
  huntId!: string;
  currentUserId?: string | null;

  constructor(
    private route: ActivatedRoute,
    private huntService: HuntsService,
    private location: Location,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.huntId = this.route.snapshot.paramMap.get('id')!;
    this.getHunt(this.huntId);
    console.log(this.currentUserId);
  }

  getHunt(huntId: string): void {
    this.huntService.getHuntById(huntId).subscribe({
      next: (data: HuntInformationViewDTO) => {
        this.hunt = data;
        this.currentUserId = this.authService.getUserId();
      },
      error: (error: any) => {
        console.error('Failed to load this hunt', error);
      },
    });
  }

  onCancel(): void {
    this.location.back();
  }

  shouldShowStopButton(): boolean {
    if (!this.hunt) return false;
    const now = new Date();
    console.log(this.hunt.startDate && new Date(this.hunt.startDate) < now);
    return (
      !this.hunt.endDate ||
      (new Date(this.hunt.endDate) > now &&
        (!this.hunt.startDate || new Date(this.hunt.startDate) < now))
    );
  }

  participate(): void {
    this.huntService.participate(this.huntId).subscribe({
      next: () => this.router.navigate(['/hunt/participating']),
    });
  }

  stopHunt(): void {
    this.huntService.stopHunt(this.huntId).subscribe({
      next: () => this.getHunt(this.huntId),
    });
  }
}
