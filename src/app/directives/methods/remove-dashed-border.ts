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
        // corners
        if (
          target?.classList.contains('left-shadow') &&
          target.classList.contains('top-shadow')
        ) {
          target.classList.remove('left-top-corner-dash');
        }
        if (
          target?.classList.contains('right-shadow') &&
          target.classList.contains('top-shadow')
        ) {
          target.classList.remove('right-top-corner-dash');
        }
        if (
          target?.classList.contains('left-shadow') &&
          target.classList.contains('bottom-shadow')
        ) {
          target.classList.remove('left-bottom-corner-dash');
        }
        if (
          target?.classList.contains('right-shadow') &&
          target.classList.contains('bottom-shadow')
        ) {
          target.classList.remove('right-bottom-corner-dash');
        }
        // single sides
        switch (className) {
          case 'left-shadow':
            target?.classList.remove('left-dash');
            break;
          case 'right-shadow':
            target?.classList.remove('right-dash');
            break;
          case 'top-shadow':
            target?.classList.remove('top-dash');
            break;
          case 'bottom-shadow':
            target?.classList.remove('bottom-dash');
            break;
        }
      }
    });
  }
}
