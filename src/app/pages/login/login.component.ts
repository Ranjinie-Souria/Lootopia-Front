import { Component } from '@angular/core';
import { BtnComponent } from "../../shared/components/btn/btn.component";
import { RoutePaths } from '../../config/route-paths';

@Component({
  selector: 'app-login',
  imports: [BtnComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  protected readonly RoutePaths = RoutePaths;
}