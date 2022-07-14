import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-point',
  template: `<div class="game-point" [ngClass]="{'game-point--active': active}"></div>`,
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  @Input() active!: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
