import { ThrowStmt } from '@angular/compiler';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FilterService } from '../../filters/filter.service';
import { Symbol } from '../../Shared/symbol.model';
import { TradeDataService } from '../trade-data.service';
@Component({
  selector: 'app-symbol-data',
  templateUrl: './symbol-data.component.html',
  styleUrls: ['./symbol-data.component.css']
})
export class SymbolDataComponent implements OnInit, OnDestroy {

  symbolData: Symbol[] = []
  symbolDataSubscription!: Subscription;
  filterDataSubscription!: Subscription;
  loading = true;

  constructor(private tradeDataService: TradeDataService, private filterService: FilterService) { }

  ngOnInit(): void {
    if (this.tradeDataService.dataAvailable) {
      this.symbolData = this.tradeDataService.getSymbolData();
      this.loading = false
    }
    this.symbolDataSubscription = this.tradeDataService.symbolDataRetrieved.subscribe(
      () => {
        this.symbolData = this.tradeDataService.getSymbolData();
        this.loading = false;
      } 
    )

    this.filterDataSubscription = this.filterService.filteredSymbolDataCreated.subscribe(
      (symbolData) => {
        this.symbolData = symbolData;
      }
    )
  }

  ngOnDestroy() {
    this.symbolDataSubscription.unsubscribe();
    this.filterDataSubscription.unsubscribe();
  }

}
