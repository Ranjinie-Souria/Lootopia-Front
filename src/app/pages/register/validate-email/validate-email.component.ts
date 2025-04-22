import { Component } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { Router } from '@angular/router';

@Component({
  selector: 'app-validate-email',
  imports: [BtnComponent],
  templateUrl: './validate-email.component.html',
  styleUrl: './validate-email.component.scss',
})
export class ValidateEmailComponent {
  protected readonly RoutePaths = RoutePaths;
}
