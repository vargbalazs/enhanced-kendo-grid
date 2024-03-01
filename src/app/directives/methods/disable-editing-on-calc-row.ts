import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// it disables editing on a calculated row
export function disableEditingOnCalculatedRow(
  grid: GridComponent,
  config: EnhancedGridConfig
) {
  config.columns[grid.activeCell.colIndex].editable = false;
  setTimeout(() => {
    config.columns[grid.activeCell.colIndex].editable = true;
  });
}
