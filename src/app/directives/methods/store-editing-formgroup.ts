import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import * as methods from './index';

// store the form group for the edited cell
export function storeEditingFormGroup(
  grid: GridComponent,
  config: EnhancedGridConfig,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
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
        `[ng-reflect-data-row-index="${grid.activeCell.dataRowIndex}"][ng-reflect-col-index="${grid.activeCell.colIndex}"]`
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
}
