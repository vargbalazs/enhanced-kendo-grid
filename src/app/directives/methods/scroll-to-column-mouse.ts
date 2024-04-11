import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// scrolls the grid, if we are selecting with the mouse and there are frozen columns
export function scrollToColumnMouse(config: EnhancedGridConfig) {
  // get the total width of the frozen columns
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content');
  const nextCell = gridContent?.querySelector(
    `[ng-reflect-data-row-index="${config.lastSelectedCell.itemKey}"][ng-reflect-col-index="${config.lastSelectedCell.columnKey}"]`
  );
  // if the grid content is scrolled and we select to the right from any of the frozen columns, then scroll
  if (
    config.firstSelectedCell.columnKey <= config.frozenColumns.length - 1 &&
    gridContent!.scrollLeft > 0 &&
    config.lastSelectedCell.columnKey > config.frozenColumns.length - 1
  ) {
    gridContent?.scrollBy({
      left: -gridContent.scrollLeft,
      behavior: 'smooth',
    });
    // handle the selected area
    if (config.selectedCells.length > 0) {
      config.selectedArea.style.visibility = 'hidden';
    }
  }
  // if we select to the right at the end
  if (
    nextCell?.getBoundingClientRect().right! >
    gridContent?.getBoundingClientRect().right!
  ) {
    gridContent?.scrollBy({
      left: nextCell?.getBoundingClientRect().width,
      behavior: 'smooth',
    });
  }
  // if we select to the left over a frozen column
  if (
    config.lastSelectedCell.columnKey <= config.frozenColumns.length - 1 &&
    gridContent!.scrollLeft > 0 &&
    config.firstSelectedCell.columnKey > config.frozenColumns.length - 1
  ) {
    gridContent?.scrollBy({
      left: -gridContent.scrollLeft,
      behavior: 'smooth',
    });
  }
  // if we select to the left, but we aren't over a frozen column yet, then scroll only one column
  if (
    config.lastSelectedCell.columnKey > config.frozenColumns.length - 1 &&
    gridContent!.scrollLeft > 0 &&
    config.selectedArea.getBoundingClientRect().left < totalWidthFrozenCol
  ) {
    gridContent?.scrollBy({
      left: -config.columns[config.lastSelectedCell.columnKey].width,
      behavior: 'smooth',
    });
  }
}
