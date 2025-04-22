import { Component, inject, OnInit } from '@angular/core';
import { RoutePaths } from '../../config/route-paths';
import { BtnComponent } from '../../shared/components/btn/btn.component';
import { HomeConnectedComponent } from './home-connected/home-connected.component';
import { HomeDisconnectedComponent } from './home-disconnected/home-disconnected.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeConnectedComponent, HomeDisconnectedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  protected isLoggedIn = false;
  protected readonly RoutePaths = RoutePaths;
  private readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
}
