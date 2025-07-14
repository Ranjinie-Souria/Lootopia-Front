import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreasureDTO } from '../../../../model/treasure.dto';
import { HuntMenuComponent } from "../../hunt-menu/hunt-menu.component";

@Component({
  selector: 'app-game-success',
  imports: [HuntMenuComponent],
  templateUrl: './game-success.component.html',
  styleUrl: '../../hunt.component.scss',
})
export class GameSuccessComponent implements OnInit {
  treasure: TreasureDTO | undefined;
  private router = inject(Router);

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras.state;
    console.log('State reçu :', state);
  }
}
