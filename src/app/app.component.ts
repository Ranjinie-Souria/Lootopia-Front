import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ModelMapperService } from './services/model-mapper.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public title = 'Lootopia';
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly modelMapper = inject(ModelMapperService);
  public user: any = null;

  ngOnInit() {
    this.authService.updateCurrentUser();
    this.user = this.modelMapper.mapTokenToUserModel(this.authService.getDecodedUserToken());
    this.userService.setUser(this.user);
  }

  subscribeToUser(userId: any): void {
    this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;
        }
      });
    }
}
