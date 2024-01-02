import { NgModule } from '@angular/core';
import { ChangeCellFocusWithTabDirective } from './chng-cellfocus-with-tab.directive';
import { SelectingWithMouseDirective } from './selecting-with-mouse.directive';
import { SelectingWithShiftDirective } from './selecting-with-shift.directive';
import { CellEditingDirective } from './cell-editing.directive';
import { CopyPasteDirective } from './copy-paste.directive';

@NgModule({
  declarations: [
    ChangeCellFocusWithTabDirective,
    CellEditingDirective,
    SelectingWithShiftDirective,
    SelectingWithMouseDirective,
    CopyPasteDirective,
  ],
  imports: [],
  exports: [
    ChangeCellFocusWithTabDirective,
    CellEditingDirective,
    SelectingWithShiftDirective,
    SelectingWithMouseDirective,
    CopyPasteDirective,
  ],
})
export class EnhancedGridDirectivesModule {}
