import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'app-hunt-success',
  templateUrl: './hunt-success.component.html',
  styleUrl: './hunt-success.component.scss',
})
export class HuntSuccessComponent implements OnInit {
  protected readonly RoutePaths = RoutePaths;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const fromMapCreation = history.state['fromMapCreation'];

    if (!fromMapCreation) {
      this.router.navigate([RoutePaths.HUNT]);
    } else {
      setTimeout(() => {
        this.router.navigate([RoutePaths.HUNT]);
      }, 3000);
    }
  }
}
