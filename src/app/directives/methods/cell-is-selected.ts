import { CellSelectionItem } from '@progress/kendo-angular-grid';

// returns a boolean, indicating if a cell is selected or not
export function cellIsSelected(
  cell: CellSelectionItem,
  selectedCells: CellSelectionItem[]
): boolean {
  return selectedCells.some(
    (item) => item.itemKey === cell.itemKey && item.columnKey === cell.columnKey
  );
}
