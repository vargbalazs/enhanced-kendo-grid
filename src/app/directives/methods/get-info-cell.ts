import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// get the cell element, for which we want to have an info tooltip
export function getInfoCell(
  columnField: string,
  rowField: string,
  rowValue: any,
  config: EnhancedGridConfig
): Element | null {
  // get the row and column indexes
  const rowIndex = config.gridData.findIndex(
    (row) => row[rowField] === rowValue
  );
  const colIndex = config.columns.findIndex((col) => col.field === columnField);
  // get the cell element
  let cell = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    `[ng-reflect-data-row-index="${rowIndex}"][ng-reflect-col-index="${colIndex}"]`
  );
  return cell;
}
