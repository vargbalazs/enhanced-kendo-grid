import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { CalcGridTopGroupedComponent } from './calc-grid-top-grouped.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CalcGridTopGroupedComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [CalcGridTopGroupedComponent],
})
export class CalcGridTopGroupedModule {}
