import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { CalcGridCustomRowComponent } from './calc-grid-custom-row.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CalcGridCustomRowComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [CalcGridCustomRowComponent],
})
export class CalcGridCustomRowModule {}
