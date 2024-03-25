import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

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
    // scroll only, if we are in a non-frozed column
    if (config.editedColIndex > config.frozenColumns.length - 1) {
      config.errorToolTip.style.left = `${
        config.errorTooltipLeft + config.gridScrollLeft - gridContent.scrollLeft
      }px`;
      // if we are beneath a frozen column (left side) or beyond the right side, then remove z-index
      if (
        config.errorToolTip.getBoundingClientRect().left <
          totalWidthFrozenCol ||
        config.errorToolTip.getBoundingClientRect().right >
          gridContent.getBoundingClientRect().right
      ) {
        config.errorToolTip.style.zIndex =
          config.errorTooltipPos === 'top' ? '0' : '-1';
      } else {
        config.errorToolTip.style.zIndex = '99';
      }
    }
  });
}
