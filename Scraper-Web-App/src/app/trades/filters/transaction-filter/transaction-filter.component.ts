import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent implements OnInit, OnDestroy {

  filterServiceAvailableSymbols!: Subscription;
  availableSymbols!: string[];
  symbolListToFilter!: string[];
  viewSymbolDropdown: boolean = false;
  searchString: string = '';
  selectAllTitles = false;
  officerTitle = {
    name: 'Officer',
    subTitles: [
      {
        name: 'CEO'
      },
      {
        name: 'CIO'
      },
      {
        name:'CINO'
      },
      {
        name: 'CFO'
      },
      {
        name: 'CMO'
      },
      {
        name: 'CLO'
      },
      {
        name: 'COO'
      },
      {
        name: 'President'
      },
      {
        name: 'VP'
      }
    ]
  }

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
    this.filterServiceAvailableSymbols = this.filterService.availableSymbolsCreated.subscribe(
      (s) => {
        this.availableSymbols = s;
        this.symbolListToFilter = s;
      }
    )
  }

  toggleSelectAllTitles(transactionDataFilterForm: NgForm) {
    this.selectAllTitles = !this.selectAllTitles

    let currentValue = transactionDataFilterForm.controls['titles'].value
    if (this.selectAllTitles) {
      for (let title of this.officerTitle.subTitles) {
        if (!currentValue.includes(title.name)) {
          currentValue.push(title.name)
        }
      }
    } else {
      for (let title of this.officerTitle.subTitles) {
        let i = currentValue.indexOf(title.name)
        if (i > -1) {
          currentValue.splice(i, 1)
        }
      }
    }
    transactionDataFilterForm.controls['titles'].setValue(currentValue)
  }

  addSymbolToSearch(symbolString: string) {
    this.searchString = symbolString
  }

  search() {
    if (this.searchString === null) return;
    this.availableSymbols = this.symbolListToFilter.filter(
      (value) => {
        return value.toLowerCase().startsWith(this.searchString.toLowerCase())
      }
    )
    console.log(this.symbolListToFilter)
  }

  filterTransactionData(transactionDataFilterForm: NgForm) {
    console.log(transactionDataFilterForm)
    const titles = this.manageTitlesValues(transactionDataFilterForm.value['titles'])
    this.filterService.filterTransactionData(
      transactionDataFilterForm.value['symbol'],
      transactionDataFilterForm.value['minShares'],
      transactionDataFilterForm.value['minValue'],
      transactionDataFilterForm.value['minChange'],
      transactionDataFilterForm.value['minDate'],
      transactionDataFilterForm.value['maxDate'],
      titles
      );
  }

  manageTitlesValues(titles: any) {
    let newTitleData = null;
    if (titles !== '' && titles !== null) {
      newTitleData = [];
      for (let title of titles) {
        newTitleData.push(title.toLowerCase())
        switch (title) {
          case 'CEO':
            newTitleData.push('chief executive officer')
            break;
          case 'CIO':
            newTitleData.push('chief information officer')
            break;
          case 'CINO':
            newTitleData.push('chief innovation officer')
            break;
          case 'CFO':
            newTitleData.push('chief financial officer')
            break;
          case 'CMO':
            newTitleData.push('chief marketing officer')
            break;
          case 'CLO':
            newTitleData.push('chief legal officer')
            break;
          case 'COO':
            newTitleData.push('chief operating officer')
            break;
        }
      }
    }
    return newTitleData;
  }

  resetFilter(transactionDataFilterForm: NgForm) {
    transactionDataFilterForm.reset();
    this.filterService.resetTransactionFilter();
    this.availableSymbols = this.symbolListToFilter;
  }

  ngOnDestroy() {
    this.filterServiceAvailableSymbols.unsubscribe();
  }

}
