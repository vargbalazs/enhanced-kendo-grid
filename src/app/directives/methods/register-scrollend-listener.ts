// registers an event listener for the scrollend event to handle the selected are, if we are selecting from a frozen column
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

  listener = renderer2.listen(gridContent, 'scrollend', (e) => {
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
  });
}
