import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NormalGridModule } from './components/normal-grid/normal-grid.module';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { CalcGridModule } from './components/calc-grid/calc-grid.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NormalGridModule,
    LayoutModule,
    CalcGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
