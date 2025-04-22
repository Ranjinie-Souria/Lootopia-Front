import { Component } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-success',
  imports: [BtnComponent],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.scss',
})
export class RegisterSuccessComponent {
  protected readonly RoutePaths = RoutePaths;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const fromRegister = nav?.extras.state?.['fromRegister'];

    if (!fromRegister) {
      this.router.navigate([RoutePaths.DEFAULT]);
    }
  }
}
