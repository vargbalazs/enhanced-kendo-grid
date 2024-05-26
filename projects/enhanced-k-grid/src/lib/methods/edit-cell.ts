import { FormGroup } from '@angular/forms';
import {
  CreateFormGroupArgs,
  GridComponent,
} from '@progress/kendo-angular-grid';

// put the cell in edit mode with the appr. data item
export function editCell(
  grid: GridComponent,
  cellEditingFormGroupFn: (args: CreateFormGroupArgs) => FormGroup
) {
  const args: CreateFormGroupArgs = {
    dataItem: grid.activeCell.dataItem,
    isNew: false,
    sender: grid,
    rowIndex: grid.activeCell.rowIndex,
  };
  grid.editCell(
    grid.activeCell.dataRowIndex,
    grid.activeCell.colIndex,
    cellEditingFormGroupFn(args)
  );
}
