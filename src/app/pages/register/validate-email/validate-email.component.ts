import { Component, inject } from '@angular/core';
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

export class ValidateEmailComponent {
  protected readonly RoutePaths = RoutePaths;
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected authService = inject(AuthService);
  protected isTokenValid : boolean = false;
  protected error = "";
  private durationBeforeRedirection = 1000 * 5 // Seconds;
  
  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if(!!token){
        if(this.checkToken(token)){
          this.isTokenValid = true;
          //this.redirect(durationBeforeRedirection)
        }
        else {
          this.error = "Error while trying to validate the email.";
        }  
      }
      else {
        this.redirect(0)
      }
    });
  }

  protected checkToken(token : string) : boolean {
    try {
      this.authService.validateEmail(token);
    }
    catch {
      return false
    }
    return true
  }

  private redirect(durationBeforeRedirection: number) : void {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, durationBeforeRedirection);
  }
}
