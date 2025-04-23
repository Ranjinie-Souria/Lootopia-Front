import { Component, inject, OnInit } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-validate-email',
  imports: [BtnComponent],
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss', '../register.component.scss'],
})

export class ValidateEmailComponent implements OnInit  {
  protected readonly RoutePaths = RoutePaths;
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  protected isTokenValid : boolean = false;
  protected error = "";
  private durationBeforeRedirection = 1000 * 5 // Seconds;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.authService.validateEmail(token).subscribe({
          next: () => {
              this.isTokenValid = true;
              this.redirect(this.durationBeforeRedirection);
          },
          error: (error) => {
            this.error = error.error?.message || "An unknown error occurred.";
          }
        });
      } else {
        this.redirect(0);
      }
    });
  }
  

  private redirect(durationBeforeRedirection: number) : void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, durationBeforeRedirection);
  }
}
