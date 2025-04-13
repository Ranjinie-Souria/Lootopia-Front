import { Component } from '@angular/core';
import { BtnComponent } from '../../shared/btn/btn.component';
import { RoutePaths } from '../../shared/route-paths';

@Component({
  selector: 'app-home',
  imports: [BtnComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected RoutePaths = RoutePaths;

}
