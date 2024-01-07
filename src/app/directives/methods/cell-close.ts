import { FormGroup } from '@angular/forms';
import {
  CellCloseEvent,
  CreateFormGroupArgs,
  GridComponent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// custom function for the cell close logic
export function cellClose(
  args: CellCloseEvent,
  config: EnhancedGridConfig,
  grid: GridComponent,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup,
  resetFn: () => void
) {
  // if cell data is invalid, then put the cell back in edit mode
  // with this, we are preventing to focus out (except if we entered in edit mode with Enter)
  // in case of Enter, the old value gets written back
  if (!(<FormGroup>args.formGroup).valid) {
    args.formGroup = config.originalDataItem;
    grid.editCell(
      config.editedRowIndex,
      config.editedColIndex,
      cellEditingFormGroupFn(args)
    );
  }
  // if we hit escape, then restore the original value
  if ((<KeyboardEvent>args.originalEvent)?.key === 'Escape') {
    // if some filters or sorting are active
    if (grid.filter?.filters || grid.sort!.length > 0) {
      // gridData will have only the filtered rows
      // dataRowIndex will have the correct row index according to the filtered data
      const gridData = (<GridDataResult>grid.data).data;
      gridData[config.editedRowIndex] = config.originalDataItem;
      // get the dataRowIndex according to the original (not filtered) data source
      config.dataRowIndexBeforeFiltering = config.gridData.find(
        (row) => row.id === config.originalDataItem.id
      ).dataRowIndex;
      // use this dataRowIndex to set the originalDataItem back
      config.gridData[config.dataRowIndexBeforeFiltering] =
        config.originalDataItem;
    } else {
      config.gridData[config.editedRowIndex] = config.originalDataItem;
    }
    config.noFocusingWithArrowKeys = false;
    resetFn();
  }
}
