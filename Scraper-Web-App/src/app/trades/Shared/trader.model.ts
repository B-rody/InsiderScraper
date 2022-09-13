import { Trade } from "./trade.model";

export class Trader {

    public totalSharesPurchasedString: string;
    public totalValuePurchasedString: string;


    constructor(
        public reportingOwnerName: string,
        public reportingOwnerCIK: string,
        public reportingOwnerTitles: string[],
        public totalSharesPurchased: number,
        public totalValuePurchased: number,
        public numberOfTrades: number,
        public trades: Trade[]
    ) {

        this.totalSharesPurchasedString = this.totalSharesPurchased.
        toLocaleString();

        this.totalValuePurchasedString = this.totalValuePurchased.
        toLocaleString('en-US', {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        });


    }
}