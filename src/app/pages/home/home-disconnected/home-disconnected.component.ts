import { Component } from '@angular/core';
import { BtnComponent } from '../../../shared/components/btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'home-disconnected',
  standalone: true,
  imports: [BtnComponent],
  templateUrl: './home-disconnected.component.html',
  styleUrl: '../home.component.scss'
})
export class HomeDisconnectedComponent {
  protected readonly RoutePaths = RoutePaths;
}
