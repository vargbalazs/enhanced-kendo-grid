import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// returns true, if the cell can be closed
// this is the case, if the active cell (the clicked one) is an other cell as the edited one
export function isActiveCellDifferent(
  config: EnhancedGridConfig,
  grid: GridComponent
): boolean {
  // if some filters or sorting are active, we have to override the edited row index
  if (grid.filter?.filters || grid.sort!.length > 0) {
    const gridData = (<GridDataResult>grid.data).data;
    config.editedRowIndex = gridData.findIndex(
      (item) => item.dataRowIndex === grid.activeCell.dataItem.dataRowIndex
    );
  }
  const sameCell =
    config.editedColIndex === grid.activeCell.colIndex &&
    config.editedRowIndex === grid.activeCell.dataRowIndex;

  return !sameCell;
}
