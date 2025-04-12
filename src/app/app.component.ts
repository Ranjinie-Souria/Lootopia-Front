import { Component } from '@angular/core';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@Component({
  selector: 'app-root',
  imports: [NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Lootopia';
}
