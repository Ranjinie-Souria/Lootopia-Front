import { Component } from '@angular/core';
import { RoutePaths } from '../../config/route-paths';
import { BtnComponent } from '../components/btn/btn.component';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  protected readonly RoutePaths = RoutePaths;

}
