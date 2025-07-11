import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HuntsService } from '../../../services/hunt.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';
import { HuntDto } from '../../../model/hunt.dto';

@Component({
  selector: 'app-hunt-create',
  imports: [CommonModule, BtnComponent, ReactiveFormsModule],
  templateUrl: './hunt-create.component.html',
  styleUrl: './hunt-create.component.scss'
})
export class HuntCreateComponent{
  private fb = inject(FormBuilder);
  private huntService = inject(HuntsService);
  private router = inject(Router);
  protected readonly RoutePaths = RoutePaths;

  minStartDate: string = '';
  minEndDate: string = '';
  createdSuccess: boolean = false;

  constructor() {
    this.setMinDates();
  }

  protected setMinDates() {
    const now = new Date();

    const minStart = new Date(now.getTime() + 30 * 60 * 1000);
    this.minStartDate = minStart.toISOString().slice(0,16);

    const minEnd = new Date(now.getTime() + 60 * 60 * 1000);
    this.minEndDate = minEnd.toISOString().slice(0,16);
  }

  protected form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    chatEnabled: [''],
    worldType: ['CARTOGRAPHIC', Validators.required],
    isPrivate: [false],
    maxParticipants: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    excavationDelay: [1, [Validators.required, Validators.min(1)]],
    excavationCost: [0, [Validators.required, Validators.min(0)]],
    startDate: ['', [Validators.required, this.startDateValidator()]],
    endDate: ['', [Validators.required, this.endDateValidator()]],
  });

  protected error: string = '';

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const payload: HuntDto = {
      creatorId: localStorage.getItem('userId') ?? '',
      title: this.form.get('title')?.value ?? '',
      description: this.form.get('description')?.value ?? '',
      chatEnabled: !!this.form.get('chatEnabled')?.value,
      worldType: (this.form.get('worldType')?.value as 'CARTOGRAPHIC' | 'REAL_WORLD') ?? 'CARTOGRAPHIC',
      isPrivate: !!this.form.get('isPrivate')?.value,
      maxParticipants: Number(this.form.get('maxParticipants')?.value ?? 1),
      price: Number(this.form.get('price')?.value ?? 0),
      excavationDelay: Number(this.form.get('excavationDelay')?.value ?? 0),
      excavationCost: Number(this.form.get('excavationCost')?.value ?? 0),
      endDate: this.form.get('endDate')?.value ?? '',
      startDate: this.form.get('startDate')?.value ?? '',
      creationDate: new Date().toISOString(),
      invitedPlayers: [],
    };

    this.huntService.createHunt(payload).subscribe({
      next: () => this.createdSuccess = true,
      error: (err) => this.handleerror(err),
    });
  }

  private handleerror(err: any): void {
    console.error(err);
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.error = 'Unknown error, please contact an administrator.';
    if (err.message) {
      this.error = 'Error : ' + err.error.message;
    }  else if (err.status === 500) {
      this.error = 'Internal server error. Please try again later.';
    }
    return;
  }

  private handleRegistrationSuccess(): void {
    this.router.navigate([RoutePaths.REGISTER_SUCCESS], {
      state: { fromRegister: true },
    });
  }

protected startDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputDate = new Date(control.value);
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    return inputDate >= thirtyMinutesFromNow ? null : { startDateTooSoon: true };
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

}
