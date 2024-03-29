import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// reposition the error tooltip, if scrolling
export function scrollErrorTooltip(
  config: EnhancedGridConfig,
  renderer2: Renderer2,
  listener: () => void
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // get the total width of the frozen columns
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }
  listener = renderer2.listen(gridContent, 'scroll', (e) => {
    // scroll only, if we are in a non-frozed column and the error tooltip is shown
    if (
      config.editedColIndex > config.frozenColumns.length - 1 &&
      document.body.contains(config.errorToolTip)
    ) {
      config.errorToolTip.style.left = `${
        config.errorTooltipLeft + config.gridScrollLeft - gridContent.scrollLeft
      }px`;
      config.errorToolTip.style.zIndex = '99';
      // handle z-index
      // if we are beneath a frozen column (left side)
      if (
        config.errorToolTip.getBoundingClientRect().left < totalWidthFrozenCol
      ) {
        config.errorToolTip.style.zIndex =
          config.errorTooltipPos === 'top' ? '0' : '-1';
      }
      // if we are beyond the right side
      if (
        config.errorToolTip.getBoundingClientRect().right >
        gridContent.getBoundingClientRect().right
      ) {
        // we have to query for the active cell, because it's position is changed since going in edit mode the first time
        let activeCell = config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.editedCell.dataRowIndex}"][ng-reflect-col-index="${config.editedCell.colIndex}"]`
        )!;
        methods.toggleErrorTooltip(
          config,
          activeCell?.getBoundingClientRect(),
          'on'
        );
      }
      // if we are beyond the left side
      if (
        config.errorToolTip.getBoundingClientRect().left <
        gridContent.getBoundingClientRect().left
      ) {
        // we have to query for the active cell, because it's position is changed since going in edit mode the first time
        let activeCell = config.gridBody.querySelector(
          `[ng-reflect-data-row-index="${config.editedCell.dataRowIndex}"][ng-reflect-col-index="${config.editedCell.colIndex}"]`
        )!;
        methods.toggleErrorTooltip(
          config,
          activeCell?.getBoundingClientRect(),
          'on'
        );
      }
      // hide or show error tooltip, if we scroll out or into the view
      if (
        (config.errorTooltipPos === 'right' &&
          config.errorToolTip.getBoundingClientRect().left <
            gridContent.getBoundingClientRect().left) ||
        (config.errorTooltipPos === 'left' &&
          config.errorToolTip.getBoundingClientRect().right >
            gridContent.getBoundingClientRect().right)
      ) {
        config.errorToolTip.style.visibility = 'hidden';
      } else {
        config.errorToolTip.style.visibility = 'visible';
      }
    }
  });
}
