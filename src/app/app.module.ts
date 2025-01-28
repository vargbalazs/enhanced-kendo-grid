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
import { CalcGridBottomGroupedModule } from './components/calc-grid-bottom-grouped/calc-grid-bottom-grouped.module';
import { CalcGridTopGroupedMultipleLevelModule } from './components/calc-grid-top-grouped-multiple-lvl/calc-grid-top-grouped.module';
import { CalcGridBottomGroupedMultipleLevelModule } from './components/calc-grid-bottom-grouped-multiple-lvl/calc-grid-bottom-grouped.module';
import { CalcGridCustomModule } from './components/calc-grid-custom/calc-grid-custom.module';
import { CalcGridCustomRowModule } from './components/calc-grid-custom-row/calc-grid-custom-row.module';
import { CalcGridInfoModule } from './components/calc-grid-info/calc-grid-info.module';
import { GridWithEmptyRowModule } from './components/grid-with-empty-row/grid-with-empty-row.module';

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
    CalcGridBottomGroupedModule,
    CalcGridTopGroupedMultipleLevelModule,
    CalcGridBottomGroupedMultipleLevelModule,
    CalcGridCustomModule,
    CalcGridCustomRowModule,
    CalcGridInfoModule,
    GridWithEmptyRowModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
