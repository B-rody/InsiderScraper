import { Component, Input, OnInit } from '@angular/core';
import { slideAnim, dropdownAnim } from 'src/app/trades/Shared/animations';
import { Trader } from 'src/app/trades/Shared/trader.model';

@Component({
  selector: 'app-trader-item',
  templateUrl: './trader-item.component.html',
  styleUrls: ['./trader-item.component.css'],
  animations: [slideAnim, dropdownAnim]
})
export class TraderItemComponent implements OnInit {

  constructor() { }

  viewTradeData = false

  @Input() trader!: Trader;

  ngOnInit(): void {
  }

  toggleTradesView() {
    this.viewTradeData = !this.viewTradeData
  }

}
