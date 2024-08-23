import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { CalcGridBottomGroupedComponent } from './calc-grid-bottom-grouped.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CalcGridBottomGroupedComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [CalcGridBottomGroupedComponent],
})
export class CalcGridBottomGroupedModule {}
