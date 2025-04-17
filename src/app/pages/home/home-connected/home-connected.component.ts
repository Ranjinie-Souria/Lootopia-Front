import { Component, inject } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, NgIf, JsonPipe } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'home-connected',
  imports: [BtnComponent, NgIf, CommonModule, JsonPipe],
  templateUrl: './home-connected.component.html',
  styleUrls: ['../home.component.scss'],
})
export class HomeConnectedComponent {
  protected readonly RoutePaths = RoutePaths;
  private readonly userService = inject(UserService)
  private readonly authService = inject(AuthService);
  user: any;

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
