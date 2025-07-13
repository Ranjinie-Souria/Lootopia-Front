import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HuntDto } from '../../../model/hunt.dto';

@Component({
  selector: 'app-link-map',
  standalone: true,
  imports: [],
  templateUrl: './link-map.component.html',
  styleUrl: './link-map.component.scss',
})
export class LinkMapComponent implements OnInit {
  hunt: any;
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const huntId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Hunt ID:', huntId);
  }
}
