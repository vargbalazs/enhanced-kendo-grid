import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalcGridOnlyColWithFiltSortPageComponent } from './calc-grid-only-col-with-filt-sort-page.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@NgModule({
  declarations: [CalcGridOnlyColWithFiltSortPageComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  providers: [],
  exports: [CalcGridOnlyColWithFiltSortPageComponent],
})
export class CalcGridOnlyColWithFiltSortPageModule {}
