import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { HuntsService } from '../../../services/hunt.service';
import { HuntUpdateDTO } from '../../../model/hunt-update.dto';
import { HuntInformationViewDTO } from '../../../model/hunt-information-view.dto';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-hunt-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BtnComponent, LoaderComponent],
  templateUrl: './hunt-edit.component.html',
  styleUrl: '../hunt-create/hunt-create.component.scss',
})
export class HuntEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private huntService = inject(HuntsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected readonly RoutePaths = RoutePaths;

  protected form!: FormGroup;
  protected huntId: string = '';
  protected loading = true;
  protected error = '';
  protected success = false;

  ngOnInit(): void {
    this.huntId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.huntId) {
      this.error = 'No hunt ID provided.';
      return;
    }

    this.huntService.getHuntById(this.huntId).subscribe({
      next: (hunt) => this.initForm(hunt),
      error: () => {
        this.error = 'Could not load hunt data.';
        this.loading = false;
      },
    });
  }

  private initForm(hunt: HuntInformationViewDTO): void {
    this.form = this.fb.group(
      {
        title: [hunt.title, Validators.required],
        description: [hunt.description, Validators.required],
        chatEnabled: [hunt.chatEnabled],
        worldType: [hunt.worldType, Validators.required],
        isPrivate: [hunt.isPrivate],
        maxParticipants: [
          hunt.maxParticipants,
          [Validators.required, Validators.min(1)],
        ],
        price: [hunt.price, [Validators.required, Validators.min(0)]],
        excavationDelay: [
          hunt.excavationDelay,
          [Validators.required, Validators.min(1)],
        ],
        excavationCost: [
          hunt.excavationCost,
          [Validators.required, Validators.min(0)],
        ],
        startDate: [hunt.startDate, [Validators.required]],
        endDate: [hunt.endDate, [Validators.required]],
        invitedPlayers: this.fb.array(
          (hunt.authorizedUsers ?? []).map((email) =>
            this.fb.control(email, [Validators.required, Validators.email]),
          ),
        ),
        treasure: this.fb.group({
          quantity: [
            hunt.treasure?.quantity ?? 1,
            [Validators.required, Validators.min(1)],
          ],
          type: [hunt.treasure?.type ?? 'CROWN', Validators.required],
          longitude: [hunt.treasure?.longitude ?? 0],
          latitude: [hunt.treasure?.latitude ?? 0],
        }),
      },
      {
        validators: this.startBeforeEndValidator(),
      },
    );

    this.loading = false;
  }

  get invitedPlayersArray(): FormArray {
    return this.form.get('invitedPlayers') as FormArray;
  }

  get invitedPlayers(): FormControl[] {
    return this.invitedPlayersArray.controls as FormControl[];
  }

  addPlayer(): void {
    this.invitedPlayersArray.push(
      this.fb.control('', [Validators.required, Validators.email]),
    );
  }

  removePlayer(index: number): void {
    this.invitedPlayersArray.removeAt(index);
  }

  update(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const value = this.form.value;

    const payload: HuntUpdateDTO = {
      title: value.title,
      description: value.description,
      chatEnabled: value.chatEnabled,
      worldType: value.worldType,
      isPrivate: value.isPrivate,
      maxParticipants: value.maxParticipants,
      price: value.price,
      excavationDelay: value.excavationDelay,
      excavationCost: value.excavationCost,
      startDate: value.startDate,
      endDate: value.endDate,
      treasure: value.treasure,
      invitedPlayers: value.invitedPlayers,
    };

    this.huntService.updateHunt(this.huntId, payload).subscribe({
      next: () => {
        this.success = true;
        this.router.navigate([this.RoutePaths.HUNT]);
      },
      error: () => {
        this.error = 'Error updating hunt. Please try again later.';
      },
    });
  }

  private startBeforeEndValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = new Date(group.get('startDate')?.value);
      const end = new Date(group.get('endDate')?.value);

      if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
      }

      return start < end ? null : { startAfterEnd: true };
    };
  }
}
