import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NormalGridModule } from './components/normal-grid/normal-grid.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CalcGridBottomModule } from './components/calc-grid-bottom/calc-grid-bottom.module';
import { GroupedGridModule } from './components/grouped-grid/grouped-grid.module';
import { CalcGridTopModule } from './components/calc-grid-top/calc-grid-top.module';
import { CalcGridTopGroupedModule } from './components/calc-grid-top-grouped/calc-grid-top-grouped.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NormalGridModule,
    LayoutModule,
    CalcGridBottomModule,
    CalcGridTopModule,
    GroupedGridModule,
    CalcGridTopGroupedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
