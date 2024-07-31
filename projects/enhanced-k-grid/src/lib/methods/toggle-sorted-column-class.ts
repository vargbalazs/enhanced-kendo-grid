import { SortDescriptor } from '@progress/kendo-data-query';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// adds or removes the sorted class to/from the cells in the sorted column
export function toggleSortedColumnClass(
  sortChangeEvent: SortDescriptor[],
  config: EnhancedGridConfig
) {
  // if there is already one sorted column, then remove the style from it
  if (config.lastSortedColIndex >= 0) {
    const cells = getSortedCells(config, config.lastSortedColIndex);
    cells?.forEach((cell) => {
      cell.classList.remove('col-sorted');
    });
    // reset lastSortedColIndex
    config.lastSortedColIndex = -1;
  }
  // get the column index of the sorted column
  const field = sortChangeEvent[0].field;
  const colIndex = config.columns.findIndex((col) => col.field === field);
  // query for the cells in the column
  const cells = getSortedCells(config, colIndex);
  // add or remove the sorted class to/from the cells
  if (sortChangeEvent[0].dir) {
    cells?.forEach((cell) => {
      cell.classList.add('col-sorted');
    });
    // store it as the last sorted column
    config.lastSortedColIndex = colIndex;
  } else {
    cells?.forEach((cell) => {
      cell.classList.remove('col-sorted');
    });
    // reset lastSortedColIndex
    config.lastSortedColIndex = -1;
  }
}

function getSortedCells(
  config: EnhancedGridConfig,
  colIndex: number
): NodeListOf<Element> | undefined {
  // query for the cells in the column
  const gridBody = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '[kendogridtablebody]'
  );
  const cells = gridBody?.querySelectorAll(
    `[ng-reflect-col-index="${colIndex}"]`
  );
  return cells;
}
