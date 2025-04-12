import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'btn',
  imports: [NgClass],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss'
})
export class BtnComponent {

  @Input() text: string = '';
  @Input() class: string = 'default';

  protected getText() {
    return this.text;
  }

  protected getStyleClass() {
    return this.class;
  }

}
