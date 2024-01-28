import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// removes the dashed border (in case of copying)
export function removeDashedBorder(config: EnhancedGridConfig) {
  for (let i = 0; i <= config.selectedCells.length - 1; i++) {
    let target = config.gridBody.querySelector(
      `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
    );
    target?.classList.forEach((className) => {
      if (
        ['left-shadow', 'right-shadow', 'bottom-shadow', 'top-shadow'].includes(
          className
        )
      ) {
        target?.classList.remove('dashed-border');
        // single sides
        target?.classList.remove('left-dash');
        target?.classList.remove('right-dash');
        target?.classList.remove('top-dash');
        target?.classList.remove('bottom-dash');
        // corners
        target?.classList.remove('left-top-corner-dash');
        target?.classList.remove('right-top-corner-dash');
        target?.classList.remove('left-bottom-corner-dash');
        target?.classList.remove('right-bottom-corner-dash');
        // all sides
        target?.classList.remove('all-side-dash');
        // specials
        target?.classList.remove('one-row-left-corner-dash');
        target?.classList.remove('one-row-right-corner-dash');
        target?.classList.remove('top-bottom-dash');
        target?.classList.remove('left-right-dash');
        target?.classList.remove('one-column-top-dash');
        target?.classList.remove('one-column-bottom-dash');
      }
    });
  }
}
