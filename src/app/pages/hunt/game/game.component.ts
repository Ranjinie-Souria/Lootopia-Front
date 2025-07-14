import { Component, inject, OnInit } from '@angular/core';
import { HuntMenuComponent } from '../hunt-menu/hunt-menu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../../../shared/components/map/map.component';
import { HuntInformationViewDTO } from '../../../model/hunt-information-view.dto';
import { HuntsService } from '../../../services/hunt.service';
import { RoutePaths } from '../../../config/route-paths';
import { TreasureDTO } from '../../../model/treasure.dto';

@Component({
  selector: 'app-game',
  imports: [HuntMenuComponent, MapComponent],
  templateUrl: './game.component.html',
  styleUrl: '../hunt.component.scss',
})
export class GameComponent implements OnInit {
  private huntService = inject(HuntsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public huntId: string | null = null;
  public hunt: HuntInformationViewDTO | undefined = undefined;
  message: string = '';
  treasure: TreasureDTO | undefined;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.huntId = params.get('huntId');
      if (this.huntId) {
        this.huntService.getHuntById(this.huntId).subscribe({
          next: (val) => {
            this.hunt = val;
          },
        });
      }
    });
  }

  onDigSuccess() {
    this.message =
      'Congratulations! You found the treasure! You will be redirected in 10 seconds...';

    setTimeout(() => {
      this.router.navigate([RoutePaths.GAME_SUCCESS], {
        state: this.treasure,
      });
    }, 10000);
  }
}
