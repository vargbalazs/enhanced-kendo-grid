import { Renderer2 } from '@angular/core';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// scrolls the info icons
export function scrollInfoIcons(
  config: EnhancedGridConfig,
  renderer2: Renderer2,
  listener: () => void
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;
  // get all info icons
  const icons = (<HTMLElement>config.gridElRef.nativeElement).querySelectorAll(
    '[info-icon'
  );
  // get the total width of the frozen columns
  let totalWidthFrozenCol = 0;
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    totalWidthFrozenCol +=
      config.columns[config.frozenColumns[i].columnIndex!].width;
  }
  listener = renderer2.listen(gridContent, 'scroll', (e) => {
    icons.forEach((icon) => {
      const colIndex = +icon.getAttribute('col-index')!;
      const startTop = +icon.getAttribute('start-top')!;
      const startLeft = +icon.getAttribute('start-left')!;
      // if we are in a non-frozen column
      if (colIndex > config.frozenColumns.length - 1) {
        // if we are beneath a frozen column (left side), then hide it
        if (
          icon.getBoundingClientRect().left -
            gridContent.getBoundingClientRect().left <
          totalWidthFrozenCol
        ) {
          (<HTMLElement>icon).style.zIndex = '0';
        }
      } else {
        // if we are in a frozen column and scroll left/right, we have to fix the icons
        if (gridContent.scrollLeft > 0) {
          //(<HTMLElement>icon).style.position = 'fixed';
          // (<HTMLElement>icon).style.top = `${
          //   startTop + gridContent.getBoundingClientRect().top
          // }px`;
          // (<HTMLElement>icon).style.left = `${
          //   startLeft + gridContent.getBoundingClientRect().left
          // }px`;
        }
      }
    });
  });
}
