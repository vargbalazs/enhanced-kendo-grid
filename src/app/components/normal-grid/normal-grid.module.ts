import { NgModule } from '@angular/core';

import { GridModule } from '@progress/kendo-angular-grid';
import { EnhancedGridDirectiveModule } from '../../directives/enhanced-grid-directive.module';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ReactiveFormsModule } from '@angular/forms';
import { NormalGridComponent } from './normal-grid.component';
import { CommonModule } from '@angular/common';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  declarations: [NormalGridComponent],
  imports: [
    CommonModule,
    GridModule,
    EnhancedGridDirectiveModule,
    ComboBoxModule,
    ReactiveFormsModule,
    DateInputsModule,
  ],
  providers: [],
  exports: [NormalGridComponent],
})
export class NormalGridModule {}
