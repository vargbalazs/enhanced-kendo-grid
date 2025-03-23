import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// gets the row indexes of all collapsed rows
export function getCollapsedRowIndexes(config: EnhancedGridConfig) {
  const collapsedRows = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('[kendogridlogicalrow][collapsed]');
  config.collapsedRowIndexes = [];
  collapsedRows.forEach((row) => {
    const rowIndex = +row.getAttribute('data-kendo-grid-item-index')!;
    if (!config.collapsedRowIndexes.includes(rowIndex))
      config.collapsedRowIndexes.push(rowIndex);
  });
}
