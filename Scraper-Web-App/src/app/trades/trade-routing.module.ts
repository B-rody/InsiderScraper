import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SymbolDataComponent } from './trade-data/symbol-data/symbol-data.component';
import { TradeDataComponent } from './trade-data/trade-data.component';
import { TransactionDataComponent } from './trade-data/transaction-data/transaction-data.component';

const routes: Routes = [
    {path:'', component: TradeDataComponent, children: [
      {path: 'symbols', component: SymbolDataComponent},
      {path: 'trades', component: TransactionDataComponent},
      {path: '', pathMatch: 'full', redirectTo:'symbols'}
    ]},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TradeRoutingModule {}