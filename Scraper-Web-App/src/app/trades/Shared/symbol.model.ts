import { Trader } from "./trader.model";

export class Symbol {


    public totalSharesPurchasedString: string;
    public totalValuePurchasedString: string;

    constructor(
        public symbol: string,
        public issuerName: string,
        public issuerCIK: string,
        public traderData: Trader[],
        public totalSharesPurchased: number,
        public totalValuePurchased: number,
        public totalInsiderBuyers: number,
        public totalBuys: number
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