import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { HuntsService } from '../../../services/hunt.service';
import { RoutePaths } from '../../../config/route-paths';
import { HuntDto } from '../../../model/hunt.dto';
import { TreasureDTO } from '../../../model/treasure.dto';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-hunt-create',
  imports: [CommonModule, BtnComponent, ReactiveFormsModule, LoaderComponent],
  templateUrl: './hunt-create.component.html',
  styleUrl: './hunt-create.component.scss',
})
export class HuntCreateComponent {
  private fb = inject(FormBuilder);
  private huntService = inject(HuntsService);
  protected readonly RoutePaths = RoutePaths;

  minStartDate: string = '';
  minEndDate: string = '';
  createdSuccess: boolean = false;
  protected error: string = '';

  constructor() {
    this.setMinDates();
  }

  protected setMinDates(): void {
    const now = new Date();
    this.minStartDate = new Date(now.getTime() + 30 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
    this.minEndDate = new Date(now.getTime() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
  }

  protected form: FormGroup = this.fb.group(
    {
      title: ['', Validators.required],
      description: ['', Validators.required],
      chatEnabled: [false],
      worldType: ['CARTOGRAPHIC', Validators.required],
      isPrivate: [false],
      maxParticipants: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      price: [0, [Validators.required, Validators.min(0)]],
      excavationDelay: [1, [Validators.required, Validators.min(1)]],
      excavationCost: [0, [Validators.required, Validators.min(0)]],
      startDate: ['', [Validators.required, this.startDateValidator()]],
      endDate: ['', [Validators.required, this.endDateValidator()]],
      invitedPlayers: this.fb.array([
        this.fb.control('', [Validators.required, Validators.email]),
      ]),

      treasure: this.fb.group({
        quantity: [1, [Validators.required, Validators.min(1)]],
        type: ['CROWN', Validators.required],
        longitude: [0, [Validators.min(-180), Validators.max(180)]],
        latitude: [0, [Validators.min(-90), Validators.max(90)]],
      }),
    },
    {
      validators: this.startBeforeEndValidator(),
    },
  );

  get invitedPlayersArray(): FormArray {
    return this.form.get('invitedPlayers') as FormArray;
  }

  get invitedPlayers(): FormControl[] {
    return (this.form.get('invitedPlayers') as FormArray)
      .controls as FormControl[];
  }

  addPlayer(): void {
    this.invitedPlayersArray.push(
      this.fb.control('', [Validators.required, Validators.email]),
    );
  }

  removePlayer(index: number): void {
    this.invitedPlayersArray.removeAt(index);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const treasureValue = this.form.get('treasure')?.value;

    const treasure: TreasureDTO = {
      quantity: treasureValue.quantity ?? 1,
      type: treasureValue.type ?? 'CROWN',
      longitude: treasureValue.longitude ?? 0,
      latitude: treasureValue.latitude ?? 0,
    };

    const payload: HuntDto = {
      creatorId: localStorage.getItem('userId') ?? '',
      title: this.form.get('title')?.value ?? '',
      description: this.form.get('description')?.value ?? '',
      chatEnabled: !!this.form.get('chatEnabled')?.value,
      worldType: this.form.get('worldType')?.value ?? 'CARTOGRAPHIC',
      isPrivate: !!this.form.get('isPrivate')?.value,
      maxParticipants: Number(this.form.get('maxParticipants')?.value ?? 1),
      price: Number(this.form.get('price')?.value ?? 0),
      excavationDelay: Number(this.form.get('excavationDelay')?.value ?? 0),
      excavationCost: Number(this.form.get('excavationCost')?.value ?? 0),
      startDate: this.form.get('startDate')?.value ?? '',
      endDate: this.form.get('endDate')?.value ?? '',
      creationDate: new Date().toISOString(),
      invitedPlayers: this.invitedPlayersArray.value,
      treasure: treasure,
    };

    this.huntService.createHunt(payload).subscribe({
      next: () => (this.createdSuccess = true),
      error: (err) => this.handleError(err),
    });
  }

  private handleError(err: any): void {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.error = 'Unknown error, please contact an administrator.';
    if (err.message) {
      this.error = 'Error : ' + err.error.message;
    } else if (err.status === 500) {
      this.error = 'Internal server error. Please try again later.';
    }
  }

  protected startDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const now = new Date();
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      return inputDate >= thirtyMinutesFromNow
        ? null
        : { startDateTooSoon: true };
    };
  }

  protected endDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const now = new Date();
      const minEndDate = new Date(now.getTime() + 60 * 60 * 1000);
      return inputDate >= minEndDate ? null : { endDateTooSoon: true };
    };
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
