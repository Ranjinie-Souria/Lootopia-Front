import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoutePaths } from '../../route-paths';
import { NgClass } from '@angular/common';

@Component({
  selector: 'lootopia-btn',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss'],
  host: {
    '[class]': 'getStyleClass()',
    '[attr.lootopia-btn]': 'true',
    '[attr.routerLink]': 'getRoute()',}
  })
export class BtnComponent {
  @Input() class: string = 'default';
  @Input() routerLinkPath: (typeof RoutePaths)[keyof typeof RoutePaths] = RoutePaths.HOME;

  protected getStyleClass() {
    return this.class;
  }

  protected getRoute() {
    return this.routerLinkPath;
  }

}
