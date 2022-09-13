import { NgModule } from '@angular/core';
import { SymbolDataComponent } from './trade-data/symbol-data/symbol-data.component';
import { TradeDataComponent } from './trade-data/trade-data.component';
import { TradeRoutingModule } from './trade-routing.module';
import { TransactionDataComponent } from './trade-data/transaction-data/transaction-data.component';
import { SymbolFilterComponent } from './filters/symbol-filter/symbol-filter.component';
import { TransactionFilterComponent } from './filters/transaction-filter/transaction-filter.component';
import { SymbolItemComponent } from './trade-data/symbol-data/symbol-item/symbol-item.component';
import { TraderItemComponent } from './trade-data/symbol-data/symbol-item/trader-item/trader-item.component';
import { MaterialsModule } from '../shared/materials.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations:[
        TradeDataComponent,
        SymbolDataComponent,
        TransactionDataComponent,
        SymbolFilterComponent,
        TransactionFilterComponent,
        SymbolItemComponent,
        TraderItemComponent
    ],
    imports: [
        TradeRoutingModule,
        MaterialsModule,
        FormsModule,
        CommonModule
    ],
    exports: [
        TradeDataComponent,
        SymbolDataComponent,
        TransactionDataComponent,
        SymbolFilterComponent,
        TransactionFilterComponent,
        SymbolItemComponent,
        TraderItemComponent
    ]
})
export class TradeModule {}