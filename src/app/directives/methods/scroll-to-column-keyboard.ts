import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';

export function scrollToColumnKeyboard(
  config: EnhancedGridConfig,
  grid: GridComponent,
  e: KeyboardEvent
) {
  // get the total width of the frozen columns
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }

  const absoluteLeft = (<HTMLElement>config.gridElRef.nativeElement).offsetLeft;
  const gridBorderWidth = parseFloat(
    getComputedStyle(config.gridElRef.nativeElement).borderLeftWidth
  );
  const gridBody = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    '[kendogridtablebody]'
  );
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content');

  // moving right
  if (e.key === ARROWS.RIGHT) {
    const focusedCell = gridBody?.querySelector(
      `[ng-reflect-data-row-index="${
        grid.activeCell.dataRowIndex
      }"][ng-reflect-col-index="${grid.activeCell.colIndex + 1}"]`
    );
    // if the focused cell is behind the last frozen column
    if (
      focusedCell?.getBoundingClientRect().left! < totalWidthFrozenCol &&
      grid.activeCell.colIndex + 1 > config.frozenColumns.length - 1
    ) {
      gridContent?.scrollBy({
        left: -gridContent.scrollLeft,
        behavior: 'smooth',
      });
    }
    // if the focused cell isn't fully visible at the right end
    if (
      focusedCell?.getBoundingClientRect().right! >
      gridContent?.getBoundingClientRect().right!
    ) {
      gridContent?.scrollBy({
        left: focusedCell?.getBoundingClientRect().width,
        behavior: 'smooth',
      });
    }
  }

  // moving with tab
  if (e.key === 'Tab') {
    // if the focused cell is behind the last frozen column
    if (
      grid.activeCell.colIndex - config.frozenColumns.length - 1 === -1 &&
      gridContent!.scrollLeft > 0
    ) {
      gridContent?.scrollBy({
        left: -gridContent.scrollLeft,
        behavior: 'smooth',
      });
    }
    // if the focused cell isn't fully visible at the right end
    const focusedCell = gridBody?.querySelector(
      `[ng-reflect-data-row-index="${grid.activeCell.dataRowIndex}"][ng-reflect-col-index="${grid.activeCell.colIndex}"]`
    );
    if (
      focusedCell?.getBoundingClientRect().right! >
      gridContent?.getBoundingClientRect().right!
    ) {
      gridContent?.scrollBy({
        left: focusedCell?.getBoundingClientRect().width,
        behavior: 'smooth',
      });
    }
  }

  // moving left
  if (e.key === ARROWS.LEFT) {
    const focusedCell = gridBody?.querySelector(
      `[ng-reflect-data-row-index="${
        grid.activeCell.dataRowIndex
      }"][ng-reflect-col-index="${grid.activeCell.colIndex - 1}"]`
    );
    if (
      focusedCell?.getBoundingClientRect().left! <= totalWidthFrozenCol &&
      grid.activeCell.colIndex - 1 > config.frozenColumns.length - 1
    ) {
      gridContent?.scrollBy({
        left:
          focusedCell?.getBoundingClientRect().left! -
          totalWidthFrozenCol -
          absoluteLeft -
          gridBorderWidth,
        behavior: 'smooth',
      });
    }
  }
}
