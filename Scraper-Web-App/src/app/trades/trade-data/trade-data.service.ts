import { Injectable, OnInit } from "@angular/core";
import { Symbol } from "../Shared/symbol.model";
import { Trade } from "../Shared/trade.model";
import { Trader } from "../Shared/trader.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

const jsonDataFile = "assets/jsonData.json"

@Injectable({
    providedIn: 'root'
  })
export class TradeDataService {
    symbolData: Symbol[] = []
    transactionData: any[] = []
    symbolDataRetrieved = new Subject();
    transactionDataRetrieved = new Subject();
    dataAvailable = false;
    constructor(private http: HttpClient) {
        this.buildSymbolData()
    }

    ngOnInit() {
    }

    getSymbolData(): Symbol[] {
        return this.symbolData;
    }

    getTransactionData(): any[] {
        return this.transactionData;
    }

    buildSymbolData() {
        return this.http.get<
        {
            "Symbol": string,
            "Issuer Name": string,
            "Issuer CIK": string,
            "Trader Data": [{
                "Reporting Owner Name": string,
                "Reporting Owner CIK": string,
                "Reporting Owner Titles": string[],
                "Total shares purchased": number,
                "Total value purchased": number,
                "Number of trades": number,
                "Trades": [{
                    "Transaction Date": string,
                    "Number of shares": number,
                    "Share Price": number,
                    "Shares Owned Post-Transaction": string
                }]
            }],
            "Total shares purchased": number,
            "Total value purchased": number,
            "Total insider buyers": number,
            "Total buys": number
        }[]>(jsonDataFile).subscribe(
            data => {
                for (let symbolItem of data) {
                    let newSymbol = new Symbol(
                        symbolItem["Symbol"],
                        symbolItem["Issuer Name"],
                        symbolItem["Issuer CIK"],
                        [],
                        symbolItem["Total shares purchased"],
                        symbolItem["Total value purchased"],
                        symbolItem["Total insider buyers"],
                        symbolItem["Total buys"]
                    )
                
                    for (let traderItem of symbolItem["Trader Data"]) {

                        let newTrader = new Trader(
                            traderItem["Reporting Owner Name"],
                            traderItem["Reporting Owner CIK"],
                            traderItem["Reporting Owner Titles"],
                            traderItem["Total shares purchased"],
                            traderItem["Total value purchased"],
                            traderItem["Number of trades"],
                            []
                        )

                        for (let tradeItem of traderItem["Trades"]) {
                            let newTrade = new Trade(
                                tradeItem["Transaction Date"],
                                tradeItem["Number of shares"],
                                tradeItem["Share Price"],
                                +tradeItem["Shares Owned Post-Transaction"]
                            )
                            let newTransaction = {
                                symbol: symbolItem["Symbol"],
                                traderName: traderItem["Reporting Owner Name"],
                                traderTitles: traderItem["Reporting Owner Titles"],
                                tradeData: newTrade
                            }
                            this.transactionData.push(newTransaction);
                            newTrader.trades.push(newTrade);
                        }
                        newSymbol.traderData.push(newTrader);
                    }
                    this.symbolData.push(newSymbol);
                }
                this.symbolDataRetrieved.next();
                this.transactionDataRetrieved.next();
                this.dataAvailable = true;
            }
        )
    }
}