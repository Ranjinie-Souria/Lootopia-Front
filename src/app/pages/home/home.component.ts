import { Component } from '@angular/core';
import { RoutePaths } from '../../shared/route-paths';
import { BtnComponent } from '../../shared/components/btn/btn.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BtnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected RoutePaths = RoutePaths;

}
