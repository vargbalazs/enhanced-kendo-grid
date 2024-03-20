import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

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
    .subscribe((value) => {
      console.log(value);
      Object.keys(config.cellEditingFormGroup.controls).forEach((control) => {
        if (config.cellEditingFormGroup.controls[control].errors)
          console.log(config.cellEditingFormGroup.controls[control].errors);
      });
    });
}
