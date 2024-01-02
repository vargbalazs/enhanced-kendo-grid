import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../interfaces/enhanced-grid-config.interface';
import * as methods from './index';

// edits the cell on keydown
export function editCellOnKeyDown(
  config: EnhancedGridConfig,
  e: KeyboardEvent,
  grid: GridComponent,
  resetFn: () => void
) {
  // exit on tab
  if (e.key === 'Tab') return;

  // exit also on ctrl and alt
  if (e.ctrlKey || e.altKey) return;

  // if we enter in edit mode or leave it with enter
  if (
    grid.activeCell.dataItem && // cell is a data cell
    e.key === 'Enter' &&
    !methods.isColumnNotEditable(
      config.columns!,
      config.columns![grid.activeCell.colIndex].field
    ) // column is editable
  ) {
    config.noFocusingWithArrowKeys = !config.noFocusingWithArrowKeys;
    resetFn();
    methods.storeOriginalValues(grid, config);
  }
}
