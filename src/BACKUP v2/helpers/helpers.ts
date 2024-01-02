import {
  CellSelectionItem,
  ColumnComponent,
} from '@progress/kendo-angular-grid';
import { CellData } from '../interfaces/celldata.interface';
import { CellSelection } from '../interfaces/cellselection.interface';
import { Aggregate } from '../interfaces/aggregate.interface';
import { Rect } from '../interfaces/rect.interface';

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
        let value: string | number;
        if (key.includes('.')) {
          const objectKey = key.substring(0, key.indexOf('.'));
          const propertyKey = key.substring(key.indexOf('.') + 1);
          value =
            gridData[firstCell.itemKey + j * verticalDirection][objectKey][
              propertyKey
            ];
        } else {
          value = gridData[firstCell.itemKey + j * verticalDirection][key];
        }
        selectedCellDatas = [
          ...selectedCellDatas,
          {
            value: value,
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

// calculates the aggregated values
export function calculateAggregates(
  aggregates: Aggregate,
  selectedCellDatas: CellData[]
): Aggregate {
  aggregates = { sum: 0, avg: 0, count: 0, min: 0, max: 0 };
  // sum
  aggregates.sum = selectedCellDatas.reduce(
    (acc, data) => (isFinite(+data.value) ? acc + +data.value : acc),
    0
  );
  // avg
  let countOfNumberValues = 0;
  selectedCellDatas.map((cellData) => {
    if (isFinite(+cellData.value)) countOfNumberValues++;
  });
  aggregates.avg =
    countOfNumberValues > 0 ? aggregates.sum / countOfNumberValues : 0;
  // count
  aggregates.count = selectedCellDatas.length;
  // min
  let filtered = selectedCellDatas.filter((data) => isFinite(+data.value));
  aggregates.min =
    filtered.length == 0
      ? 0
      : +filtered.reduce((prev, curr) =>
          +prev.value < +curr.value ? prev : curr
        ).value;
  // max
  aggregates.max =
    filtered.length == 0
      ? 0
      : +filtered.reduce((prev, curr) =>
          +prev.value > +curr.value ? prev : curr
        ).value;
  return aggregates;
}

// positions and resizes the selected area according to the relation of the first and last selected cells
export function resizeSelectedArea(
  lastSelectedCell: CellSelectionItem,
  selectedCells: CellSelectionItem[],
  selectedArea: HTMLDivElement,
  firstSelectedCellRect: Rect,
  lastSelectedCellRect: Rect
) {
  const firstSelectedCell = selectedCells[0];
  // right down quarter
  if (
    lastSelectedCell.columnKey >= firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey <= lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${firstSelectedCellRect.left}px`;
    selectedArea.style.top = `${firstSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      lastSelectedCellRect.left +
      lastSelectedCellRect.width -
      firstSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      lastSelectedCellRect.top +
      lastSelectedCellRect.height -
      firstSelectedCellRect.top -
      1
    }px`;
  }
  // right up quarter
  if (
    lastSelectedCell.columnKey > firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey > lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${firstSelectedCellRect.left}px`;
    selectedArea.style.top = `${lastSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      lastSelectedCellRect.left +
      lastSelectedCellRect.width -
      firstSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      firstSelectedCellRect.top +
      firstSelectedCellRect.height -
      lastSelectedCellRect.top -
      1
    }px`;
  }
  // left up quarter
  if (
    lastSelectedCell.columnKey <= firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey >= lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${lastSelectedCellRect.left}px`;
    selectedArea.style.top = `${lastSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      firstSelectedCellRect.left +
      firstSelectedCellRect.width -
      lastSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      firstSelectedCellRect.top +
      firstSelectedCellRect.height -
      lastSelectedCellRect.top -
      1
    }px`;
  }
  // left down quarter
  if (
    lastSelectedCell.columnKey < firstSelectedCell.columnKey &&
    firstSelectedCell.itemKey < lastSelectedCell.itemKey
  ) {
    // set position
    selectedArea.style.left = `${lastSelectedCellRect.left}px`;
    selectedArea.style.top = `${firstSelectedCellRect.top - 1}px`;
    // resize
    selectedArea.style.width = `${
      firstSelectedCellRect.left +
      firstSelectedCellRect.width -
      lastSelectedCellRect.left -
      1
    }px`;
    selectedArea.style.height = `${
      lastSelectedCellRect.top +
      lastSelectedCellRect.height -
      firstSelectedCellRect.top -
      1
    }px`;
  }
}

// reset the styles of the selected area
export function resetSelectedArea(selectedArea: HTMLDivElement) {
  selectedArea.style.width = '0px';
  selectedArea.style.height = '0px';
  selectedArea.style.border = 'none';
  selectedArea.classList.remove('dashed-border');
}

// sets the rect values of a given cell
export function setRectValues(cellRect: Rect, target: HTMLElement) {
  cellRect.left = target?.getClientRects().item(0)!.left;
  cellRect.top = target?.getClientRects().item(0)!.top;
  cellRect.width = target?.getClientRects().item(0)!.width;
  cellRect.height = target?.getClientRects().item(0)!.height;
}
