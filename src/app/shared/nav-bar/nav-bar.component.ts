import { Component } from '@angular/core';
import { BtnComponent } from '../../shared/btn/btn.component';
import { RoutePaths } from '../../shared/route-paths';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  protected RoutePaths = RoutePaths;

}
