import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';
import * as methods from './index';

// inserts calculated rows based on a field and it's value
export function insertCalcRowsByField(
  config: EnhancedGridConfig,
  calcRow: CalculatedRow
) {
  // find the index, where the calculated row has to be inserted
  // per default we insert the calculated row at the bottom
  let findIndex = -1;
  if (calcRow.align === 'top') {
    for (let i = 0; i <= config.gridData.length - 1; i++) {
      if (
        config.gridData[i][calcRow.calculateByField?.fieldName!] ===
        calcRow.calculateByField?.fieldValue
      ) {
        findIndex = i;
        break;
      }
    }
  } else {
    for (let i = config.gridData.length - 1; i >= 0; i--) {
      if (
        config.gridData[i][calcRow.calculateByField?.fieldName!] ===
        calcRow.calculateByField?.fieldValue
      ) {
        findIndex = i;
        break;
      }
    }
  }
  methods.insertRowAtPosition(config, findIndex, calcRow);
}
