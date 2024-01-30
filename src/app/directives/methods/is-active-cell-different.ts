import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// returns true, if the cell can be closed
// this is the case, if the active cell (the clicked one) is an other cell as the edited one
export function isActiveCellDifferent(
  config: EnhancedGridConfig,
  grid: GridComponent
): boolean {
  const sameCell =
    config.editedColIndex === grid.activeCell.colIndex &&
    config.editedRowIndex ===
      grid.activeCell.dataRowIndex - (grid.skip ? grid.skip : 0);

  return !sameCell;
}
