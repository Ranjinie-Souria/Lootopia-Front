import { Component, inject, OnInit } from '@angular/core';
import { HuntMenuComponent } from '../hunt-menu/hunt-menu.component';
import { HuntsService } from '../../../services/hunt.service';
import { HuntInformationViewDTO } from '../../../model/hunt-information-view.dto';
import { PageDTO } from '../../../model/page.dto';
import { CommonModule } from '@angular/common';
import { HuntDto } from '../../../model/hunt.dto';

@Component({
  selector: 'app-hunt-participating',
  imports: [HuntMenuComponent, CommonModule],
  templateUrl: './hunt-participating.component.html',
  styleUrl: '../hunt.component.scss',
})
export class HuntParticipatingComponent implements OnInit {
  private huntService = inject(HuntsService);
  protected participatingHunts: PageDTO<HuntDto> | null = null;

  ngOnInit(): void {
    this.huntService.getMyParticipatingHunts().subscribe({
      next: (val) => {
        this.participatingHunts = val;
        console.log(val);
      },
      error: (err) => {
        console.debug(err);
      },
    });
  }
}
