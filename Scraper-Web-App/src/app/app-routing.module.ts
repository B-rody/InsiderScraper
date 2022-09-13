import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { DisclaimerComponent } from './legal/disclaimer/disclaimer.component';
import { LegalComponent } from './legal/legal.component';
import { PrivacyPolicyComponent } from './legal/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './legal/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: 'data',
    loadChildren: () => import('./trades/trade.module').then(m => m.TradeModule)
  },
  {path: 'about', component: AboutComponent},
  {path:'legal', component: LegalComponent, children: [
    {path: 'privacy', component: PrivacyPolicyComponent},
    {path: 'terms', component: TermsAndConditionsComponent},
    {path: 'disclaimer', component: DisclaimerComponent},
    {path: '', pathMatch: 'full', redirectTo:'disclaimer'}
  ]},
  {path: '', pathMatch: 'full', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      preloadingStrategy: PreloadAllModules
    }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
