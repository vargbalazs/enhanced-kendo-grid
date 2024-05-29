import { SortDescriptor } from '@progress/kendo-data-query';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// adds or removes the sorted class to/from the cells in the sorted column
export function toggleSortedColumnClass(
  sortChangeEvent: SortDescriptor[],
  config: EnhancedGridConfig
) {
  // get the column index of the sorted column
  const field = sortChangeEvent[0].field;
  const colIndex = config.columns.findIndex((col) => col.field === field);
  // query for the cells in the column
  const gridBody = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '[kendogridtablebody]'
  );
  const cells = gridBody?.querySelectorAll(
    `[ng-reflect-col-index="${colIndex}"]`
  );
  // add or remove the sorted class to/from the cells
  if (sortChangeEvent[0].dir) {
    cells?.forEach((cell) => {
      cell.classList.add('col-sorted');
    });
  } else {
    cells?.forEach((cell) => {
      cell.classList.remove('col-sorted');
    });
  }
}
