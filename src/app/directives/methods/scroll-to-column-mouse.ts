import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// scrolls the grid, if we are selectin with the mouse and there are frozen columns
export function scrollToColumnMouse(config: EnhancedGridConfig) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content');
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
  }
  // if we select to the left
  if (
    config.lastSelectedCell.columnKey <= config.frozenColumns.length - 1 &&
    gridContent!.scrollLeft > 0
  ) {
    gridContent?.scrollBy({
      left: -gridContent.scrollLeft,
      behavior: 'smooth',
    });
  }
}
