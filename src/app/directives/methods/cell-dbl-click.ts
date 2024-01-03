import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import { FormGroup } from '@angular/forms';

// sets the current cell into edit mode
export function cellDblClick(
  grid: GridComponent,
  config: EnhancedGridConfig,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
  if (grid.activeCell.dataItem) {
    config.noFocusingWithArrowKeys = true;
    // store the original values
    methods.storeOriginalValues(grid, config);
    // mark cell as selected
    config.selectedCells.push({
      itemKey: grid.activeCell.dataRowIndex,
      columnKey: grid.activeCell.colIndex,
    });
    // step into edit mode
    methods.editCell(grid, cellEditingFormGroupFn);
  }
}
