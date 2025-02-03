import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import * as methods from './index';
import { CellValueChangingEvent } from '../interfaces/cellvalue-changing-event.interface';

// store the form group for the edited cell
export function storeEditingFormGroup(
  grid: GridComponent,
  config: EnhancedGridConfig,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
  // if we have a date column and double click on the cell, the grid.activeCell has it's value
  // but if we select a new day by clicking the calendar icon and selecting a day from the calendar,
  // the grid.activeCell is undefined, that's why we have to store the activeCell
  const activeCell = grid.activeCell;
  const args: CreateFormGroupArgs = {
    dataItem: grid.activeCell.dataItem,
    isNew: false,
    sender: grid,
    rowIndex: grid.activeCell.rowIndex,
  };
  config.cellEditingFormGroup = cellEditingFormGroupFn(args);
  // subscribe for status changing
  config.statusChanges$ = config.cellEditingFormGroup.statusChanges
    .pipe(debounceTime(1))
    .subscribe((status) => {
      // if showing error messages is allowed, then assign the error messages to the form errors
      if (config.showCellErrorMessages) {
        Object.keys(config.cellEditingFormGroup.controls).forEach((control) => {
          if (config.cellEditingFormGroup.controls[control].errors) {
            const controlErrors = <Map<string, any>>(
              config.cellEditingFormGroup.controls[control].errors
            );
            config.errors = [];
            for (let i = 0; i <= Object.keys(controlErrors).length - 1; i++) {
              const errorMessage = config.errorMessages.find(
                (errorMessage) =>
                  errorMessage.error === Object.keys(controlErrors)[i]
              )?.message;
              config.errors.push(errorMessage ? errorMessage : '');
            }
          }
        });
      }
      // get the pos of the edited cell
      let activeCell = config.gridBody.querySelector(
        `[kendogridlogicalrow][data-kendo-grid-item-index="${grid.activeCell.dataRowIndex}"] [kendogridcell][data-kendo-grid-column-index="${grid.activeCell.colIndex}"]`
      );
      config.editedCell = grid.activeCell;
      config.domRectEditedCell = activeCell!.getBoundingClientRect();
      // toggle the tooltip
      if (config.showCellErrorMessages)
        methods.toggleErrorTooltip(
          config,
          config.domRectEditedCell,
          status === 'INVALID' ? 'on' : 'off'
        );
    });
  // subscribe for value changing
  config.valueChanges$ = config.cellEditingFormGroup.valueChanges.subscribe(
    (dataItem) => {
      const keyAndField = methods.extractKeyAndField(
        //config.columns[grid.activeCell.colIndex].field
        config.columns[activeCell.colIndex].field
      );
      let oldValue: any = '';
      if (keyAndField.fieldName) {
        oldValue =
          config.originalDataItem[keyAndField.key][keyAndField.fieldName];
      } else {
        oldValue = config.originalDataItem[keyAndField.key];
      }
      let newValue: any = '';
      if (keyAndField.fieldName) {
        newValue = dataItem[keyAndField.key]
          ? dataItem[keyAndField.key][keyAndField.fieldName]
          : null;
      } else {
        newValue = dataItem[keyAndField.key];
      }
      const cellValueChangingEvent: CellValueChangingEvent = {
        cellEditingFormGroup: config.cellEditingFormGroup,
        activeCell: activeCell, //grid.activeCell,
        keyAndField: keyAndField,
        oldValue: oldValue,
        newValue: newValue,
      };
      config.cellValueChangingEvent.emit(cellValueChangingEvent);
      config.cellValueChangingEventValue = cellValueChangingEvent;
    }
  );
}
