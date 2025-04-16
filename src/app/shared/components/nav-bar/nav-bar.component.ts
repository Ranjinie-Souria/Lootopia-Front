import { Component } from '@angular/core';
import { RoutePaths } from '../../route-paths';
import { BtnComponent } from '../btn/btn.component';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  protected RoutePaths = RoutePaths;

}
