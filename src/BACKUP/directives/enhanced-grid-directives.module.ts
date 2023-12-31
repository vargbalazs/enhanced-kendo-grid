import { NgModule } from '@angular/core';
import { ChangeCellFocusWithTabDirective } from './chng-cellfocus-with-tab.directive';
import { SelectingWithMouseDirective } from './selecting-with-mouse.directive';
import { SelectingWithShiftDirective } from './selecting-with-shift.directive';
import { CellEditingDirective } from './cell-editing.directive';

@NgModule({
  declarations: [
    ChangeCellFocusWithTabDirective,
    CellEditingDirective,
    SelectingWithShiftDirective,
    SelectingWithMouseDirective,
  ],
  imports: [],
  exports: [
    ChangeCellFocusWithTabDirective,
    CellEditingDirective,
    SelectingWithShiftDirective,
    SelectingWithMouseDirective,
  ],
})
export class EnhancedGridDirectivesModule {}
