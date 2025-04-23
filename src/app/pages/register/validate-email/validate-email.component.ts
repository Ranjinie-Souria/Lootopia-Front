import { Component, inject, OnInit } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../../../services/register.service';

@Component({
  selector: 'app-validate-email',
  imports: [BtnComponent],
  templateUrl: './validate-email.component.html',
  styleUrls: ['./validate-email.component.scss'],
})

export class ValidateEmailComponent implements OnInit  {
  protected readonly RoutePaths = RoutePaths;
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected registerService = inject(RegisterService);
  protected isTokenValid : boolean = false;
  protected error = "";
  private durationBeforeRedirection = 1000 * 5 // Seconds;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.registerService.validateEmail(token).subscribe({
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
