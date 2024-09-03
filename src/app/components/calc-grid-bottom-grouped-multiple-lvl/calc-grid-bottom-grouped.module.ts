import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { CalcGridBottomGroupedMultipleLevelComponent } from './calc-grid-bottom-grouped-multiple-lvl';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CalcGridBottomGroupedMultipleLevelComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [CalcGridBottomGroupedMultipleLevelComponent],
})
export class CalcGridBottomGroupedMultipleLevelModule {}
