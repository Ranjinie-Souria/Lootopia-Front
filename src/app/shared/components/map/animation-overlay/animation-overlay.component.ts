import {
  Component,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-animation-overlay',
  imports: [FormsModule, NgFor, NgForOf],
  templateUrl: './animation-overlay.component.html',
  styleUrls: ['./animation-overlay.component.scss'],
})
export class AnimationOverlay {
  // Props-like inputs for Angular
  private _needsAnimation: boolean = false;
  private _foundSomething: boolean = false;
  private _chestContent?: string;

  @Input()
  set needsAnimation(value: boolean) {
    this._needsAnimation = value;
  }
  get needsAnimation(): boolean {
    return this._needsAnimation;
  }

  @Input()
  set foundSomething(value: boolean) {
    this._foundSomething = value;
  }
  get foundSomething(): boolean {
    return this._foundSomething;
  }

  @Input()
  set chestContent(value: string | undefined) {
    this._chestContent = value;
  }
  get chestContent(): string | undefined {
    return this._chestContent;
  }

  public isDigging: boolean = false;
  public hasDug: boolean = false;
  public showChest: boolean = false;
  public chestOpenedState: boolean = false;
  public showUnboxResults: boolean = false;
  public isBurying: boolean = false;
  public hasBuried: boolean = false;

  constructor(private router: Router) {}

  @Output() digStarted = new EventEmitter<void>();
  @Output() digEnded = new EventEmitter<void>();
  @Output() chestOpened = new EventEmitter<void>();
  @Output() closeAnimation = new EventEmitter<void>();
  @Output() buryStarted = new EventEmitter<void>();
  @Output() buryEnded = new EventEmitter<void>();

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['needsAnimation']) {
      const current = changes['needsAnimation'].currentValue;
      if (!current) {
        this.isDigging = false;
        this.hasDug = false;
        this.showChest = false;
        this.chestOpenedState = false;
        this.showUnboxResults = false;
        this.isBurying = false;
        this.hasBuried = false;
      }
    }
  }

  public closeEverything() {
    console.log('Closing animation overlay');
    this.isDigging = false;
    this.hasDug = false;
    this.showChest = false;
    this.chestOpenedState = false;
    this.showUnboxResults = false;
    this.isBurying = false;
    this.hasBuried = false;
    this.closeAnimation.emit();
  }

  public startDigging() {
    this.isDigging = true;
    this.digStarted.emit();

    setTimeout(() => {
      this.isDigging = false;
      this.hasDug = true;
      this.showChest = true;
      this.digEnded.emit();
    }, 3000);
  }

  public startBurying() {
    this.isBurying = true;
    this.buryStarted.emit();

    setTimeout(() => {
      this.isBurying = false;
      this.hasBuried = true;
      this.buryEnded.emit();
    }, 3000);
  }

  public openChest() {
    this.chestOpenedState = true;
    this.chestOpened.emit();
    setTimeout(() => {
      this.showUnboxResults = true;
    }, 2000);
  }
}
