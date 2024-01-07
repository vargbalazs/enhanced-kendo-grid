import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// if we click an other data cell except the edited one, then close it
export function cellClickAfterEditing(
  grid: GridComponent,
  config: EnhancedGridConfig,
  resetFn: () => void
) {
  if (grid.activeCell) {
    if (grid.activeCell.dataItem) {
      if (methods.isActiveCellDifferent(config, grid))
        methods.closeEditedCell(grid, config, resetFn);
    }
  }
}
