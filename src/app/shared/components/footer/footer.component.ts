import { Component } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'footer',
  imports: [BtnComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly RoutePaths = RoutePaths;
}
