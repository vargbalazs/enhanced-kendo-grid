import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { GridWithEmptyRowComponent } from './grid-with-empty-row.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [GridWithEmptyRowComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
  ],
  providers: [],
  exports: [GridWithEmptyRowComponent],
})
export class GridWithEmptyRowModule {}
