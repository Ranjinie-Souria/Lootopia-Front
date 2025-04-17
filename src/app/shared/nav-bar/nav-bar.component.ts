import { Component, inject, Input, OnInit } from '@angular/core';
import { RoutePaths } from '../../config/route-paths';
import { BtnComponent } from '../components/btn/btn.component';
import { AuthService, DecodedToken } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  protected readonly RoutePaths = RoutePaths;
  protected isLoggedIn = false;
  private authService = inject(AuthService)
  private readonly router = inject(Router);
  @Input() user: DecodedToken | null = null;


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  protected logout() : void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate([RoutePaths.DEFAULT]);
  }

}
