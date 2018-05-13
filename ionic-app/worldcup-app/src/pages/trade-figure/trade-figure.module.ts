import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeFigurePage } from './trade-figure';

@NgModule({
  declarations: [
    TradeFigurePage,
  ],
  imports: [
    IonicPageModule.forChild(TradeFigurePage),
  ],
})
export class TradeFigurePageModule {}
