import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// before editing, we store all the relevant original values
export function storeOriginalValues(
  grid: GridComponent,
  config: EnhancedGridConfig
) {
  // if paging is enabled, we can't rely on the build in dataRowIndex, because it starts in this case always from 0 for each page
  // so we need to find the correct index ourselves
  config.editedRowIndex = config.gridData.findIndex(
    (item) => item.dataRowIndex === grid.activeCell.dataItem.dataRowIndex
  );
  // if some filters or sorting are active, we store the edited row index in a separate variable
  if (grid.filter?.filters || grid.sort!.length > 0) {
    const gridData = (<GridDataResult>grid.data).data;
    config.editedRowIndexFilterOrSort = gridData.findIndex(
      (item) => item.dataRowIndex === grid.activeCell.dataItem.dataRowIndex
    );
  }
  config.editedColIndex = grid.activeCell.colIndex;
  config.originalDataItem = {};
  Object.assign(config.originalDataItem, grid.activeCell.dataItem);
}
