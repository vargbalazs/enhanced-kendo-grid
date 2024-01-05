import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we click an other data cell except the edited one, then close it
export function cellClickAfterEditing(
  grid: GridComponent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  if (grid.activeCell) {
    if (grid.activeCell.dataItem) {
      // if we begin to select with the mouse, then close the edited cell
      if (config.isMouseDown) {
        grid.closeCell();
        config.noFocusingWithArrowKeys = false;
        resetFn();
      }
      // close also if we click somewhere else
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
}
