import {
  CellSelectionItem,
  ColumnComponent,
} from '@progress/kendo-angular-grid';
import { CellData } from '../interfaces/celldata.interface';
import { CellSelection } from '../interfaces/cellselection.interface';

// marks the cells as selected in every direction
export function markCellsAsSelected(
  lastSelectedCell: CellSelectionItem,
  selectedCells: CellSelectionItem[],
  selectedCellDatas: CellData[],
  columns: ColumnComponent[],
  gridData: any[]
): CellSelection {
  const firstCell = selectedCells[0];
  const rowOffset = Math.abs(firstCell.itemKey - lastSelectedCell.itemKey);
  const columnOffset = Math.abs(
    firstCell.columnKey - lastSelectedCell.columnKey
  );
  const verticalDirection =
    firstCell.itemKey < lastSelectedCell.itemKey ? 1 : -1;
  const horizontalDirection =
    firstCell.columnKey < lastSelectedCell.columnKey ? 1 : -1;
  // we always start with the first selected cell, because we can not only add, but remove too
  selectedCells = [firstCell];
  selectedCellDatas = [selectedCellDatas[0]];
  for (let i = 0; i <= columnOffset; i++) {
    for (let j = 0; j <= rowOffset; j++) {
      if (
        !cellIsSelected(
          {
            itemKey: firstCell.itemKey + j * verticalDirection,
            columnKey: firstCell.columnKey + i * horizontalDirection,
          },
          selectedCells
        )
      ) {
        selectedCells = [
          ...selectedCells,
          {
            itemKey: firstCell.itemKey + j * verticalDirection,
            columnKey: firstCell.columnKey + i * horizontalDirection,
          },
        ];
        let key = columns[firstCell.columnKey + i * horizontalDirection].field;
        selectedCellDatas = [
          ...selectedCellDatas,
          {
            value: gridData[firstCell.itemKey + j * verticalDirection][key],
          },
        ];
      }
    }
  }
  return { selectedCells: selectedCells, selectedCellDatas: selectedCellDatas };
}

// returns a boolean, indicating if a cell is selected or not
export function cellIsSelected(
  cell: CellSelectionItem,
  selectedCells: CellSelectionItem[]
): boolean {
  return selectedCells.some(
    (item) => item.itemKey === cell.itemKey && item.columnKey === cell.columnKey
  );
}
