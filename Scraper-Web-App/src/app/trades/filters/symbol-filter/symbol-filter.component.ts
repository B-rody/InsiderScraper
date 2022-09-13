import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-symbol-filter',
  templateUrl: './symbol-filter.component.html',
  styleUrls: ['./symbol-filter.component.css']
})
export class SymbolFilterComponent implements OnInit, OnDestroy {

  filterServiceAvailableSymbols!: Subscription;
  availableSymbols!: string[];
  symbolListToFilter!: string[];
  viewSymbolDropdown: boolean = false;
  searchString: string = ''

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
    this.filterServiceAvailableSymbols = this.filterService.availableSymbolsCreated.subscribe(
      (s) => {
        this.availableSymbols = s; 
        this.symbolListToFilter = s;
      }
    )
  }

  addSymbolToSearch(symbolString: string) {
    this.searchString = symbolString
  }

  search() {
    if (this.searchString === null) return;
    this.availableSymbols = this.symbolListToFilter.filter(
      (symbol) => {
        return symbol.toLowerCase().startsWith(this.searchString.toLowerCase())
      }
    )
  }

  filterSymbolData(symbolDataFilterForm: NgForm) {
    console.log(symbolDataFilterForm)
    this.filterService.filterSymbolData(
      symbolDataFilterForm.value['symbol'], 
      symbolDataFilterForm.value['minShares'],
      symbolDataFilterForm.value['minValue'],
      symbolDataFilterForm.value['minBuyers'],
      symbolDataFilterForm.value['minBuys']
      );
  }

  resetFilter(symbolDataFilterForm: NgForm) {
    symbolDataFilterForm.reset();
    this.filterService.resetSymbolFilter();
    this.availableSymbols = this.symbolListToFilter;
  }

  ngOnDestroy() {
    this.filterServiceAvailableSymbols.unsubscribe()
  }

}
