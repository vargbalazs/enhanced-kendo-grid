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
    // if we are in a calculated row (and not in a non-editable column), then make the column not editable
    if (
      grid.activeCell.dataItem.calculated &&
      !config.nonEditableColumns.some(
        (nec) => nec.index === grid.activeCell.colIndex
      )
    ) {
      methods.disableEditingOnCalculatedRow(grid, config);
      return;
    }
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
    // disable paging
    if (grid.pageable) methods.handlePaging(config, 'off');
    // disable filtering
    if (grid.filterable) methods.handleFiltering(config, 'off');
  }
}
