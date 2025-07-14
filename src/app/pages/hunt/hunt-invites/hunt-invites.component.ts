import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HuntInformationViewDTO } from '../../../model/hunt-information-view.dto';
import { HuntWhitelistDto } from '../../../model/hunt-whitelist.dto';
import { PageDTO } from '../../../model/page.dto';
import { HuntsService } from '../../../services/hunt.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { HuntMenuComponent } from '../hunt-menu/hunt-menu.component';
import { InviteResponsePipe } from './invite-response.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hunt-invites',
  templateUrl: './hunt-invites.component.html',
  styleUrls: ['../hunt.component.scss'],
  imports: [
    CommonModule,
    LoaderComponent,
    HuntMenuComponent,
    InviteResponsePipe,
  ],
})
export class HuntInvitesComponent implements OnInit {
  invitedHunts: PageDTO<HuntWhitelistDto> | null = null;
  huntDetails: HuntInformationViewDTO[] = [];
  loading = false;
  error = '';
  huntId: string = '';
  inviteToAccept = false;
  huntToAccept: HuntInformationViewDTO | null = null;
  alreadyAccepted = false;

  private huntService = inject(HuntsService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.huntId = this.route.snapshot.paramMap.get('id') || '';
    this.inviteToAccept = !!this.huntId;
    this.loadHuntInvites();
  }

  loadHuntInvites(): void {
    this.loading = true;

    this.huntService.getMyInvites().subscribe({
      next: (page: PageDTO<HuntWhitelistDto>) => {
        this.invitedHunts = page;

        const ids = page.content.map((invite) => invite.huntId).filter(Boolean);

        if (ids.length === 0) {
          this.huntDetails = [];
          this.loading = false;
          return;
        }

        const detailCalls = ids.map((id) => this.huntService.getHuntById(id!));

        forkJoin(detailCalls).subscribe({
          next: (details) => {
            this.huntDetails = details;
            if (this.inviteToAccept && this.huntId) {
              this.huntToAccept =
                details.find((hunt) => hunt.id?.toString() === this.huntId) ||
                null;

              const invite = page.content.find(
                (inv) => inv.huntId === this.huntId,
              );
              if (
                invite &&
                invite.response &&
                invite.response !== 'NO_RESPONSE'
              ) {
                this.alreadyAccepted = true;
              }
            }

            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  acceptInvite(accepted: boolean, huntId: string): void {
    const invite = this.invitedHunts?.content.find((i) => i.huntId === huntId);
    if (!invite) {
      return;
    }
    this.huntService.answerInvite(huntId, accepted).subscribe({
      next: () => {
        invite.response = accepted ? 'ACCEPT' : 'REFUSE';
      }
    });
  }
}
