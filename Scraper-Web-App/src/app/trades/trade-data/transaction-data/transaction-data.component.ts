import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from '../../filters/filter.service';
import { TradeDataService } from '../trade-data.service';

@Component({
  selector: 'app-transaction-data',
  templateUrl: './transaction-data.component.html',
  styleUrls: ['./transaction-data.component.css']
})
export class TransactionDataComponent implements OnInit, OnDestroy {

  transactionDataRetrieved!: Subscription;
  filterDataSubscription!: Subscription;
  loading = true;
  
  transactionData: any[] = []

  sortData = {
    'sortingAsc': '',
    'sortingDesc': ''
  }

  constructor(private tradeDataService: TradeDataService, private filterService: FilterService) { }

  ngOnInit(): void {
    if (this.tradeDataService.dataAvailable) {
      this.transactionData = this.tradeDataService.getTransactionData()
      this.loading = false;
    }
    this.transactionDataRetrieved = this.tradeDataService.transactionDataRetrieved.subscribe(
      () => {
        this.transactionData = this.tradeDataService.getTransactionData();
        this.loading = false;
      }
    );

    this.filterDataSubscription = this.filterService.filteredTransactionDataCreated.subscribe(
      (transactionData) => this.transactionData = transactionData
    )
  }

  ngOnDestroy() {
    this.filterDataSubscription.unsubscribe();
    this.transactionDataRetrieved.unsubscribe();

  }

  sortColumn(column: string) {
    switch(column) {
      case 'symbol': {
        if (this.sortData.sortingDesc === 'symbol') {
          this.sortData.sortingDesc = ''
          this.sortData.sortingAsc = 'symbol'
          this.sortAsc(column)
        } else {
          this.sortData.sortingDesc = 'symbol'
          this.sortData.sortingAsc = ''
          this.sortDesc(column)
        }
        break;
      }
      case 'date': {
        if (this.sortData.sortingDesc === 'date') {
          this.sortData.sortingDesc = ''
          this.sortData.sortingAsc = 'date'
          this.sortAsc('tradeData', 'transactionDate')
        } else {
          this.sortData.sortingDesc = 'date'
          this.sortData.sortingAsc = ''
          this.sortDesc('tradeData', 'transactionDate')
        }
        break;
      }
      case 'shares': {
        if (this.sortData.sortingDesc === 'shares') {
          this.sortData.sortingDesc = ''
          this.sortData.sortingAsc = 'shares'
          this.sortAsc('tradeData', 'numberOfSharesTransacted')
        } else {
          this.sortData.sortingDesc = 'shares'
          this.sortData.sortingAsc = ''
          this.sortDesc('tradeData', 'numberOfSharesTransacted')
        }
        break;
      }
      case 'value': {
        if (this.sortData.sortingDesc === 'value') {
          this.sortData.sortingDesc = ''
          this.sortData.sortingAsc = 'value'
          this.sortAsc('tradeData', 'transactionValue')
        } else {
          this.sortData.sortingDesc = 'value'
          this.sortData.sortingAsc = ''
          this.sortDesc('tradeData', 'transactionValue')
        }
        break;
      }
      case 'change': {
        if (this.sortData.sortingDesc === 'change') {
          this.sortData.sortingDesc = ''
          this.sortData.sortingAsc = 'change'
          this.sortAsc('tradeData', 'percentOwnershipChange')
        } else {
          this.sortData.sortingDesc = 'change'
          this.sortData.sortingAsc = ''
          this.sortDesc('tradeData', 'percentOwnershipChange')
        }
        break;
      }
    }
  }

  private sortDesc(firstProp: string, secondProp?: string) {
    if (!secondProp) {
        this.transactionData = this.transactionData.sort(
          (a, b) => {
            return b[firstProp] > a[firstProp] ? 1 : -1
          })
    } else {
      this.transactionData = this.transactionData.sort(
        (a, b) => {
          return b[firstProp][secondProp] > a[firstProp][secondProp] ? 1: -1
        })
    }

  }

  private sortAsc(firstProp: string, secondProp?: string) {
    if (!secondProp) {
        this.transactionData = this.transactionData.sort(
          (a, b) => {
            return b[firstProp] < a[firstProp] ? 1: -1
          })
    } else {
      this.transactionData = this.transactionData.sort(
        (a, b) => {
          return b[firstProp][secondProp] < a[firstProp][secondProp] ? 1: -1
        })
    }

  }

}
