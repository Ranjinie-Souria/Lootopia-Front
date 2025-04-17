import { Component, inject } from '@angular/core';
import { RoutePaths } from '../../../config/route-paths';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'home-connected',
  imports: [CommonModule],
  templateUrl: './home-connected.component.html',
  styleUrls: ['../home.component.scss'],
})
export class HomeConnectedComponent {
  protected readonly RoutePaths = RoutePaths;
  private readonly userService = inject(UserService)
  user: any;

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
  }
}
