// registers an event listener for the scrollend event to handle the selected area in different scenarios
import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

export function registerScrollEndListener(
  config: EnhancedGridConfig,
  renderer2: Renderer2,
  listener: () => void
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content');
  // get the total width of the frozen columns
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }
  listener = renderer2.listen(gridContent, 'scrollend', (e) => {
    // if we are selecting from left to right from a frozen column
    if (
      //gridContent?.scrollLeft === 0 &&
      config.firstSelectedCell.columnKey <= config.frozenColumns.length - 1 &&
      config.selectedCells.length > 0
    ) {
      let target = <HTMLElement>(
        config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.firstSelectedCell.itemKey}"][ng-reflect-col-index="${config.firstSelectedCell.columnKey}"]`
        )
      );
      methods.setRectValues(config.firstSelectedCellRect, target, config);
      config.selectedArea.style.visibility = 'visible';
      methods.resizeSelectedArea(config);
    }
    // if we are selecting from right to left over a frozen column
    if (
      config.lastSelectedCell.columnKey <= config.frozenColumns.length - 1 &&
      config.selectedCells.length > 0
    ) {
      let target = <HTMLElement>(
        config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.lastSelectedCell.itemKey}"][ng-reflect-col-index="${config.lastSelectedCell.columnKey}"]`
        )
      );
      methods.setRectValues(config.lastSelectedCellRect, target, config);
      config.selectedArea.style.visibility = 'visible';
      config.selectedArea.style.zIndex = '99';
      methods.resizeSelectedArea(config);
    }
    // if we are selecting from a non-frozen column and the selected area is below the frozen columns, then set z-index accordingly
    if (
      config.firstSelectedCellRect.left - gridContent!.scrollLeft <=
        totalWidthFrozenCol &&
      config.selectedCells.length > 0 &&
      config.firstSelectedCell.columnKey > config.frozenColumns.length - 1
    ) {
      config.selectedArea.style.zIndex = '0';
    }
  });
}
