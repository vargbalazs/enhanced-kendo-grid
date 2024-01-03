import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';

// indicates, if we reached the right end of the data table
export function rightEndReached(grid: GridComponent): boolean {
  return grid.activeCell.colIndex >= grid.columns.length - 1;
}

// indicates, if we reached the left end of the data table
export function leftEndReached(grid: GridComponent): boolean {
  return grid.activeCell.colIndex === 0;
}

// indicates, if we reached the top of the data table
export function topEndReached(grid: GridComponent): boolean {
  return grid.activeCell.dataRowIndex < 1;
}

// indicates, if we reached the bottom end of the data table
export function bottomEndReached(grid: GridComponent): boolean {
  return grid.activeCell.dataRowIndex + 1 === (<GridDataResult>grid.data).total;
}
