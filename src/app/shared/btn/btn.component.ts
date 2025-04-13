import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutePaths } from '../route-paths';

@Component({
  selector: 'btn',
  imports: [NgClass, RouterModule],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss'
})
export class BtnComponent {
  @Input() text: string = '';
  @Input() class: string = 'default';
  @Input() routerLinkPath: (typeof RoutePaths)[keyof typeof RoutePaths] = RoutePaths.HOME;

  protected getText() {
    return this.text;
  }

  protected getStyleClass() {
    return this.class;
  }

  protected getRoute() {
    return this.routerLinkPath;
  }

}
