import { Component, inject, Input, OnInit } from '@angular/core';
import { RoutePaths } from '../../../config/route-paths';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { AuthService, DecodedToken } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../model/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  protected readonly RoutePaths = RoutePaths;
  protected isLoggedIn = false;
  protected currentuser: any;
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  @Input() user: DecodedToken | null = null;
  user$!: Observable<User | null>;

  ngOnInit() {
    this.user$ = this.userService.loadCurrentUserFromToken();
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.userService.user$.subscribe((user) => {
      this.currentuser = user;
    });
  }

  protected logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate([RoutePaths.DEFAULT]);
  }
}
