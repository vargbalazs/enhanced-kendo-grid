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
    config.infoTooltips.forEach((tooltip) => {
      const colIndex = config.columns.findIndex(
        (col) => col.field === tooltip.columnField
      );
      // if we are in a non-frozen column
      if (colIndex > config.frozenColumns.length - 1) {
        // if we are beneath a frozen column (left side), then hide it
        if (
          icons[0].getBoundingClientRect().left -
            gridContent.getBoundingClientRect().left <
          totalWidthFrozenCol
        ) {
          (<HTMLElement>icons[0]).style.zIndex = '0';
        }
      }
    });
  });
}
