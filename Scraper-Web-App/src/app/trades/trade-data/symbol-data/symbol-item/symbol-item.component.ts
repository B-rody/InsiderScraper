import { Component, Input, OnInit } from '@angular/core';
import { dropdownAnim, slideAnim } from 'src/app/trades/Shared/animations';
import { Symbol } from '../../../Shared/symbol.model';

@Component({
  selector: 'app-symbol-item',
  templateUrl: './symbol-item.component.html',
  styleUrls: ['./symbol-item.component.css'],
  animations: [slideAnim, dropdownAnim]
})
export class SymbolItemComponent implements OnInit {

  constructor() { }

  @Input() symbolItem!: Symbol;

  viewTraderData = false;

  ngOnInit(): void {
  }

  toggleTraderView() {
    this.viewTraderData = !this.viewTraderData
  }

}
