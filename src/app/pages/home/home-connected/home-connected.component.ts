import { Component } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'home-connected',
  imports: [BtnComponent],
  templateUrl: './home-connected.component.html',
  styleUrl: '../home.component.scss',
})
export class HomeConnectedComponent {
  protected readonly RoutePaths = RoutePaths;
}
