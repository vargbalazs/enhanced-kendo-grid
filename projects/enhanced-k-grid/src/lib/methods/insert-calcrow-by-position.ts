import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';
import * as methods from './index';

// inset calc rows based on the position
export function insertCalcRowByPosition(
  config: EnhancedGridConfig,
  calcRow: CalculatedRow
) {
  // if the position is greater, than the existing rows+1, then error
  if (calcRow.position! > config.gridData.length) {
    console.error(
      `The row ${calcRow.name} can't be inserted into the grid, because it's position is greater than the total count of rows in the grid.`
    );
    return;
  }
  methods.insertRowAtPosition(config, calcRow.position! - 1, calcRow);
}
