import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import { ARROW_KEYS, NOT_ALLOWED_KEYS_FOR_EDITING } from '../consts/constants';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

// edits the cell on keydown
export function editCellOnKeyDown(
  config: EnhancedGridConfig,
  e: KeyboardEvent,
  grid: GridComponent,
  resetFn: () => void,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
  // exit on tab
  if (e.key === 'Tab') return;

  // exit also on ctrl and alt
  if (e.ctrlKey || e.altKey) return;

  // if we enter in edit mode or leave it with enter
  if (
    grid.activeCell.dataItem && // cell is a data cell
    e.key === 'Enter' &&
    !methods.isColumnNotEditable(
      config.columns,
      config.columns[grid.activeCell.colIndex].field
    ) // column is editable
  ) {
    // if we are in a calculated row, then make the column not editable
    if (grid.activeCell.dataItem.calculated) {
      methods.disableEditingOnCalculatedRow(grid, config);
      return;
    }
    config.noFocusingWithArrowKeys = !config.noFocusingWithArrowKeys;
    resetFn();
    methods.storeOriginalValues(grid, config);
    // disable paging, if feature was allowed
    if (grid.pageable) methods.handlePaging(config, 'off');
    // disable filtering, if feature was allowed
    if (grid.filterable) methods.handleFiltering(config, 'off');
    // if grid is a calc grid, then mark it for recalculating
    if (config.calculatedGrid) config.shouldRecalculate = true;
    // store the form group for the edited cell, but only if there is no stored form group already
    if (Object.keys(config.cellEditingFormGroup.controls).length == 0) {
      methods.storeEditingFormGroup(grid, config, cellEditingFormGroupFn);
    }
  }

  // if we enter in edit mode via typing any character, except enter or arrow keys or any other not allowed keys
  if (
    grid.activeCell.dataItem && // we presss a key on a data cell
    !methods.isColumnNotEditable(
      config.columns,
      config.columns[grid.activeCell.colIndex].field
    ) && // column is editable
    !NOT_ALLOWED_KEYS_FOR_EDITING.includes(e.key) && // the pressed key is a 'regular' one
    !grid.isEditingCell() // we are not in edit mode elsewhere in the grid
  ) {
    // store the form group for the edited cell
    methods.storeEditingFormGroup(grid, config, cellEditingFormGroupFn);
    // if we are in a calculated row, then make the column not editable
    if (grid.activeCell.dataItem.calculated) {
      methods.disableEditingOnCalculatedRow(grid, config);
      return;
    }
    // get the column field name (key)
    config.fieldName = config.columns[grid.activeCell.colIndex].field;
    // if the given field is an object, then we are in a list, so we need the arrow keys to navigate through it
    // otherwise we can move the focus to the next cell
    config.noFocusingWithArrowKeys = config.fieldName.includes('.');
    // store the original values (if we hit escape, we can set the value to the old one)
    methods.storeOriginalValues(grid, config);
    // set the field value to undefined - with this we start fresh in the cell
    // if the field is an object, then we have to modify the fieldName, because the fieldName is a property of that object
    if (config.fieldName.includes('.'))
      config.fieldName = config.fieldName.substring(
        0,
        config.fieldName.indexOf('.')
      );
    grid.activeCell.dataItem[config.fieldName] = undefined;
    // step into edit mode
    methods.editCell(grid, cellEditingFormGroupFn);
    // disable paging
    if (grid.pageable) methods.handlePaging(config, 'off');
    // disable filtering
    if (grid.filterable) methods.handleFiltering(config, 'off');
    // if grid is a calc grid, then mark it for recalculating
    if (config.calculatedGrid) config.shouldRecalculate = true;
  }

  // if we are in edit mode (not via enter key), then if we press the arrow keys, we change the focus
  // if we hold shift, the focus should remain in the cell
  if (grid.isEditingCell() && !config.noFocusingWithArrowKeys && !e.shiftKey) {
    if (ARROW_KEYS.includes(e.key)) {
      grid.closeCell();
      grid.focusCell(grid.activeCell.rowIndex, grid.activeCell.colIndex);
    }
  }
}
