export class Trade {

    public percentOwnershipChange: number;
    public transactionValueString: string;
    public transactionValue: number;
    public sharePriceString: string;
    public numberOfSharesTransactedString: string;
    public transactionDate: Date;

    constructor(
        public transactionDateString: string,
        public numberOfSharesTransacted: number,
        public sharePrice: number,
        public sharesOwnedPostTransaction: number,
    ) {
        const originalNumberOwned = this.sharesOwnedPostTransaction - numberOfSharesTransacted
        this.percentOwnershipChange = +((numberOfSharesTransacted / originalNumberOwned) * 100).toFixed(2)
        this.transactionValue = (numberOfSharesTransacted * sharePrice)
        this.transactionValueString = (this.transactionValue).
            toLocaleString('en-US', {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2
            });
        this.sharePriceString = sharePrice.
            toLocaleString('en-US', {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2
            });
        this.numberOfSharesTransactedString = numberOfSharesTransacted.toLocaleString()
        this.transactionDate = new Date(this.transactionDateString + ' 00:00')
    }
}