import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import {
  ARROW_KEYS,
  ARROWS,
  NOT_ALLOWED_KEYS_FOR_EDITING,
} from '../consts/constants';
import { FormGroup } from '@angular/forms';
import { KeyAndField } from '../interfaces/key-and-field.interface';
import { CellValueChangingEvent } from '../interfaces/cellvalue-changing-event.interface';

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
    // and the field isn't a boolean one
    // we don't want to store the form group in case of a boolean field, because we don't want to subscribe to the
    // valueChanges event of the form group in this case; if the field is a boolean one, we just emit the new value
    if (
      Object.keys(config.cellEditingFormGroup.controls).length == 0 &&
      !isFieldBoolean(config, grid)
    ) {
      methods.storeEditingFormGroup(grid, config, cellEditingFormGroupFn);
    }
    // if the column is a checkbox column (it's value is a boolean), then switch the value and return
    if (isFieldBoolean(config, grid)) {
      toggleCeckboxValue(config, grid, cellEditingFormGroupFn);
      methods.disableEditingOnCalculatedRow(grid, config);
      // enable paging, if feature was allowed
      if (grid.pageable) methods.handlePaging(config, 'on');
      // enable filtering, if feature was allowed
      if (grid.filterable) methods.handleFiltering(config, 'on');
      return;
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
    // if we are in a calculated row, then make the column not editable
    if (grid.activeCell.dataItem.calculated) {
      methods.disableEditingOnCalculatedRow(grid, config);
      return;
    }
    // store the form group for the edited cell, but only if we are typing in a non-boolean field (reason see above)
    if (!isFieldBoolean(config, grid))
      methods.storeEditingFormGroup(grid, config, cellEditingFormGroupFn);
    // if the column is a checkbox column (it's value is a boolean), no editing is allowed -> return
    // in case of space switching the values is allowed, but after that also return
    if (isFieldBoolean(config, grid)) {
      if (e.code !== 'Space') {
        methods.disableEditingOnCalculatedRow(grid, config);
        return;
      } else {
        toggleCeckboxValue(config, grid, cellEditingFormGroupFn);
        return;
      }
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
      // if the edited field is of type date, then we have to set back the date to the entered one
      // because moving out from cell with up or down modifies the date
      // this code is written to increase or decrease the DAY part
      // if hours/mins/sec/ms are also used, we can modifiy the algorithm
      const keyAndField = methods.extractKeyAndField(
        config.columns[grid.activeCell.colIndex].field
      );
      const value = getValueFromFormGroup(keyAndField, config);
      if (value instanceof Date) {
        if (e.key === ARROWS.UP) {
          config.cellEditingFormGroup.patchValue({
            day: new Date(value.getTime() - 24 * 60 * 60 * 1000),
          });
        }
        if (e.key === ARROWS.DOWN) {
          config.cellEditingFormGroup.patchValue({
            day: new Date(value.getTime() + 24 * 60 * 60 * 1000),
          });
        }
      }
      grid.closeCell();
      grid.focusCell(grid.activeCell.rowIndex, grid.activeCell.colIndex);
    }
  }
}

function getValueFromFormGroup(
  keyAndField: KeyAndField,
  config: EnhancedGridConfig
): any {
  if (keyAndField.fieldName) {
    return config.cellEditingFormGroup.get(
      `${keyAndField.key}.${keyAndField.fieldName}`
    )?.value;
  } else {
    return config.cellEditingFormGroup.controls[keyAndField.key].value;
  }
}

function isFieldBoolean(
  config: EnhancedGridConfig,
  grid: GridComponent
): boolean {
  const keyAndField = methods.extractKeyAndField(
    config.columns[grid.activeCell.colIndex].field
  );
  let value: any = '';
  if (keyAndField.fieldName) {
    value = grid.activeCell.dataItem[keyAndField.key]
      ? grid.activeCell.dataItem[keyAndField.key][keyAndField.fieldName]
      : null;
  } else {
    value = grid.activeCell.dataItem[keyAndField.key];
  }
  return typeof value === 'boolean';
}

function getActiveCellValue(
  config: EnhancedGridConfig,
  grid: GridComponent
): any {
  const keyAndField = methods.extractKeyAndField(
    config.columns[grid.activeCell.colIndex].field
  );
  let value: any = '';
  if (keyAndField.fieldName) {
    value = grid.activeCell.dataItem[keyAndField.key][keyAndField.fieldName];
  } else {
    value = grid.activeCell.dataItem[keyAndField.key];
  }
  return value;
}

function toggleCeckboxValue(
  config: EnhancedGridConfig,
  grid: GridComponent,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
  const keyAndField = methods.extractKeyAndField(
    config.columns[grid.activeCell.colIndex].field
  );
  let value = getActiveCellValue(config, grid);
  if (keyAndField.fieldName) {
    grid.activeCell.dataItem[keyAndField.key][keyAndField.fieldName] = !value;
  } else {
    grid.activeCell.dataItem[keyAndField.key] = !value;
  }
  const args: CreateFormGroupArgs = {
    dataItem: grid.activeCell.dataItem,
    isNew: false,
    sender: grid,
    rowIndex: grid.activeCell.rowIndex,
  };
  config.cellEditingFormGroup = cellEditingFormGroupFn(args);
  const cellValueChangingEvent: CellValueChangingEvent = {
    cellEditingFormGroup: config.cellEditingFormGroup,
    activeCell: grid.activeCell,
    keyAndField: keyAndField,
    oldValue: value,
    newValue: !value,
  };
  config.cellValueChangingEvent.emit(cellValueChangingEvent);
}
