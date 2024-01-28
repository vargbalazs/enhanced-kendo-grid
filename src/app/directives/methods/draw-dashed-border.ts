import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// if we copy something to the clipboard, it draws a dashed border around the selected area
export function drawDashedBorders(config: EnhancedGridConfig) {
  for (let i = 0; i <= config.selectedCells.length - 1; i++) {
    let target = config.gridBody.querySelector(
      `[ng-reflect-data-row-index="${config.selectedCells[i].itemKey}"][ng-reflect-col-index="${config.selectedCells[i].columnKey}"]`
    );
    // if the selected cell is a border cell
    target?.classList.forEach((className) => {
      if (
        ['left-shadow', 'right-shadow', 'bottom-shadow', 'top-shadow'].includes(
          className
        )
      ) {
        target?.classList.add('dashed-border');
        // if just only one cell is selected/copied
        if (config.selectedCells.length === 1) {
          target?.classList.add('all-side-dash');
          return;
        }
        // if it is just one row
        const rowIndex = config.selectedCells[0].itemKey;
        if (config.selectedCells.every((cell) => cell.itemKey === rowIndex)) {
          if (
            target?.classList.contains('top-shadow') &&
            target?.classList.contains('left-shadow') &&
            target?.classList.contains('bottom-shadow')
          ) {
            target?.classList.add('one-row-left-corner-dash');
          } else if (
            target?.classList.contains('top-shadow') &&
            target?.classList.contains('right-shadow') &&
            target?.classList.contains('bottom-shadow')
          ) {
            target?.classList.add('one-row-right-corner-dash');
          } else if (
            target?.classList.contains('top-shadow') &&
            target.classList.contains('bottom-shadow')
          ) {
            target.classList.add('top-bottom-dash');
          }
          return;
        }
        // if it is just one column
        const colIndex = config.selectedCells[0].columnKey;
        if (config.selectedCells.every((cell) => cell.columnKey === colIndex)) {
          if (
            target?.classList.contains('left-shadow') &&
            target.classList.contains('top-shadow') &&
            target.classList.contains('right-shadow')
          ) {
            target.classList.add('one-column-top-dash');
          } else if (
            target?.classList.contains('left-shadow') &&
            target.classList.contains('bottom-shadow') &&
            target.classList.contains('right-shadow')
          ) {
            target.classList.add('one-column-bottom-dash');
          } else if (
            target?.classList.contains('left-shadow') &&
            target.classList.contains('right-shadow')
          ) {
            target.classList.add('left-right-dash');
          }
          return;
        }
        // corners
        if (
          target?.classList.contains('left-shadow') &&
          target.classList.contains('top-shadow')
        ) {
          target.classList.add('left-top-corner-dash');
        }
        if (
          target?.classList.contains('right-shadow') &&
          target.classList.contains('top-shadow')
        ) {
          target.classList.add('right-top-corner-dash');
        }
        if (
          target?.classList.contains('left-shadow') &&
          target.classList.contains('bottom-shadow')
        ) {
          target.classList.add('left-bottom-corner-dash');
        }
        if (
          target?.classList.contains('right-shadow') &&
          target.classList.contains('bottom-shadow')
        ) {
          target.classList.add('right-bottom-corner-dash');
        }
        // single sides
        switch (className) {
          case 'left-shadow':
            target?.classList.add('left-dash');
            break;
          case 'right-shadow':
            target?.classList.add('right-dash');
            break;
          case 'top-shadow':
            target?.classList.add('top-dash');
            break;
          case 'bottom-shadow':
            target?.classList.add('bottom-dash');
            break;
        }
      }
    });
  }
}
