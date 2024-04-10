import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';
import * as methods from './index';
import { Renderer2 } from '@angular/core';

export function scrollToColumnKeyboard(
  config: EnhancedGridConfig,
  grid: GridComponent,
  e: KeyboardEvent,
  renderer2: Renderer2
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
      // handle selecting with shift
      if (config.selectedCells.length > 0) {
        config.selectedArea.style.visibility = 'hidden';
      }
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
      // if we are selecting and the selected area is below the frozen columns, then set z-index accordingly
      if (
        config.firstSelectedCellRect.left - gridContent!.scrollLeft <=
          totalWidthFrozenCol &&
        config.selectedCells.length > 0
      ) {
        config.selectedArea.style.zIndex = '0';
      }
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
      // gridContent?.scrollBy({
      //   left:
      //     focusedCell?.getBoundingClientRect().left! -
      //     totalWidthFrozenCol -
      //     absoluteLeft -
      //     gridBorderWidth,
      //   behavior: 'smooth',
      // });
      gridContent?.scrollBy({
        left:
          focusedCell?.getBoundingClientRect().left! -
          totalWidthFrozenCol -
          config.columns[grid.activeCell.colIndex - 1].width,
        behavior: 'smooth',
      });
    }
  }
}
