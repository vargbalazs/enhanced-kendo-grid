import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we click an other data cell except the edited one, then close it
export function cellClickAfterEditing(
  grid: GridComponent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  if (grid.activeCell.dataItem) {
    const sameCell =
      config.editedColIndex === grid.activeCell.colIndex &&
      config.editedRowIndex === grid.activeCell.dataRowIndex;
    if (!sameCell) {
      grid.closeCell();
      config.noFocusingWithArrowKeys = false;
      resetFn();
    }
  }
}
