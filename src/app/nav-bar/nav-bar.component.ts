import { Component } from '@angular/core';
import { BtnComponent } from '../shared/btn/btn.component';

@Component({
  selector: 'nav-bar',
  imports: [BtnComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

}
