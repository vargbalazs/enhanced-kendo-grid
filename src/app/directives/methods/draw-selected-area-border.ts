import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

export function drawSelectedAreaBorder(config: EnhancedGridConfig) {
  let target: any;
  // paint borders (shadows) to the bounds of the selected area
  let topLeftCell = config.firstSelectedCell;
  let bottomRightCell = config.lastSelectedCell;
  // right-down
  if (
    config.firstSelectedCell.itemKey <= config.lastSelectedCell.itemKey &&
    config.firstSelectedCell.columnKey <= config.lastSelectedCell.columnKey
  ) {
    topLeftCell = config.firstSelectedCell;
    bottomRightCell = config.lastSelectedCell;
  }
  // left-up
  if (
    config.firstSelectedCell.itemKey >= config.lastSelectedCell.itemKey &&
    config.firstSelectedCell.columnKey >= config.lastSelectedCell.columnKey
  ) {
    topLeftCell = config.lastSelectedCell;
    bottomRightCell = config.firstSelectedCell;
  }
  // right-up
  if (
    config.firstSelectedCell.itemKey >= config.lastSelectedCell.itemKey &&
    config.firstSelectedCell.columnKey <= config.lastSelectedCell.columnKey
  ) {
    topLeftCell = config.selectedCells.find(
      (cell) =>
        cell.itemKey === config.lastSelectedCell.itemKey &&
        cell.columnKey === config.firstSelectedCell.columnKey
    )!;
    bottomRightCell = config.selectedCells.find(
      (cell) =>
        cell.itemKey === config.firstSelectedCell.itemKey &&
        cell.columnKey === config.lastSelectedCell.columnKey
    )!;
  }
  // left-down
  if (
    config.firstSelectedCell.itemKey <= config.lastSelectedCell.itemKey &&
    config.firstSelectedCell.columnKey >= config.lastSelectedCell.columnKey
  ) {
    topLeftCell = config.selectedCells.find(
      (cell) =>
        cell.itemKey === config.firstSelectedCell.itemKey &&
        cell.columnKey === config.lastSelectedCell.columnKey
    )!;
    bottomRightCell = config.selectedCells.find(
      (cell) =>
        cell.itemKey === config.lastSelectedCell.itemKey &&
        cell.columnKey === config.firstSelectedCell.columnKey
    )!;
  }
  for (let i = 0; i <= config.selectedCells.length - 1; i++) {
    // left side
    if (config.selectedCells[i].columnKey === topLeftCell.columnKey) {
      // get the appr. td element
      target = config.gridBody.querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      );
      // add the shadow
      target.classList.add('left-shadow');
    }
    // top
    if (config.selectedCells[i].itemKey === topLeftCell.itemKey) {
      // get the appr. td element
      target = config.gridBody.querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      );
      // add the shadow
      target.classList.add('top-shadow');
    }
    // right side
    if (config.selectedCells[i].columnKey === bottomRightCell.columnKey) {
      // get the appr. td element
      target = config.gridBody.querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      );
      // add the shadow
      target.classList.add('right-shadow');
    }
    // bottom
    if (config.selectedCells[i].itemKey === bottomRightCell.itemKey) {
      // get the appr. td element
      target = config.gridBody.querySelector(
        `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
      );
      // add the shadow
      target.classList.add('bottom-shadow');
    }
  }
}
