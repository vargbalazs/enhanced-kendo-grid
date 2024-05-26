import { CellSelectionItem } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// simple method for getting the last selected cell
export function getLastSelectedCell(
  config: EnhancedGridConfig
): CellSelectionItem {
  return config.selectedCells[config.selectedCells.length - 1];
}
