import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// closes the edited cell and resets
export function closeEditedCell(
  grid: GridComponent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  grid.closeCell();
  config.noFocusingWithArrowKeys = false;
  resetFn();
}
