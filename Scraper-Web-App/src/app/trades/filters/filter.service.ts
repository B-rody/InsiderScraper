import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Symbol } from "../Shared/symbol.model";
import { TradeDataService } from "../trade-data/trade-data.service";

@Injectable({providedIn: 'root'})
export class FilterService {

    filteredSymbolDataCreated: Subject<Symbol[]> = new Subject<Symbol[]>();
    filteredTransactionDataCreated: Subject<any[]> = new Subject<any[]>();
    availableSymbolsCreated: Subject<string[]> = new Subject<string[]>();
    symbolDataCreated!: Subscription;
    constructor(private tradeDataService: TradeDataService) { 
        let sub = this.tradeDataService.symbolDataRetrieved.subscribe(
            (s) => {
                this.shareSymbolList()
                sub.unsubscribe()
            }
        )
    }


    shareSymbolList() {
        let result = []
        for (let symbolData of this.tradeDataService.getSymbolData().slice()) {
            result.push(symbolData.symbol);
        }
        result.sort(
            (a, b) => { return a.localeCompare(b) }
        )
        this.availableSymbolsCreated.next(result);
    }
    filterSymbolData(symbol: string , minShares: number, minValue: number, minBuyers: number, minBuys: number) {
        let filteredData = this.tradeDataService.getSymbolData().slice()
        if (symbol !== '' && symbol !== null) {
            filteredData = filteredData.filter(
                s => {
                    return s.symbol.toLowerCase() === symbol.toLowerCase();
                }
            )
        }

        if (minShares > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.totalSharesPurchased >= minShares;
                }
            )
        }

        if (minValue > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.totalValuePurchased >= minValue
                }
            )
        }

        if (minBuyers > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.totalInsiderBuyers >= minBuyers
                }
            )
        }

        if (minBuys > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.totalBuys >= minBuys
                }
            )
        }

        this.filteredSymbolDataCreated.next(filteredData);
    }

    filterTransactionData(symbol: string, minShares: number, minValue: number, minChange: number,
        minDate: any, maxDate: any, titles: any) {
        let filteredData = this.tradeDataService.getTransactionData().slice()
        if (symbol !== '' && symbol !== null) {
            filteredData = filteredData.filter(
                s => {
                    return s.symbol.toLowerCase() === symbol.toLowerCase();
                }
            )
        }

        if (minShares > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.tradeData.numberOfSharesTransacted >= minShares;
                }
            )
        }

        if (minValue > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.tradeData.transactionValue >= minValue
                }
            )
        }

        if (minChange > 0) {
            filteredData = filteredData.filter(
                s => {
                    return s.tradeData.percentOwnershipChange >= minChange
                }
            )
        }

        if (minDate !== null && minDate !== '') {
            filteredData = filteredData.filter(
                s => {
                    return (
                        s.tradeData.transactionDate.getFullYear() >= minDate.getFullYear() &&
                        s.tradeData.transactionDate.getMonth() >= minDate.getMonth() &&
                        s.tradeData.transactionDate.getDate() >= minDate.getDate()
                    )
                }
            )
        }

        if (maxDate !== null && maxDate !== '') {
            filteredData = filteredData.filter(
                s => {
                    return (
                        s.tradeData.transactionDate.getFullYear() <= maxDate.getFullYear() &&
                        s.tradeData.transactionDate.getMonth() <= maxDate.getMonth() &&
                        s.tradeData.transactionDate.getDate() <= maxDate.getDate()
                    )
                        
                }
            )
        }

        if (titles !== null && titles !== '') {
            filteredData = filteredData.filter(
                s => {
                    const reportingTitles = s.traderTitles.toString().toLowerCase()
                    for (let t of titles) {
                        if (reportingTitles.includes(t)) {
                            return true;
                        }
                    }
                    return false;
                }
            )
        }

        this.filteredTransactionDataCreated.next(filteredData);

    }

    resetSymbolFilter() {
        this.filteredSymbolDataCreated.next(this.tradeDataService.getSymbolData())
    }

    resetTransactionFilter() {
        this.filteredTransactionDataCreated.next(this.tradeDataService.getTransactionData())
    }


}