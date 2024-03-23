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
      Object.keys(config.cellEditingFormGroup.controls).forEach((control) => {
        // if (config.cellEditingFormGroup.controls[control].errors)
        //   console.log(config.cellEditingFormGroup.controls[control].errors);
      });
      // get the pos of the edited cell
      let activeCell = config.gridBody.querySelector(
        `[ng-reflect-data-row-index="${grid.activeCell.dataRowIndex}"][ng-reflect-col-index="${grid.activeCell.colIndex}"]`
      );
      const rect = activeCell!.getBoundingClientRect();
      // toggle the tooltip
      methods.toggleErrorTooltip(
        config,
        rect,
        status === 'INVALID' ? 'on' : 'off'
      );
    });
}
