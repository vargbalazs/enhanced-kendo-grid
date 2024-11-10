import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// get data from a calculated row in a given column
export function getCalcData(
  calcRowName: string,
  columnField: string,
  config: EnhancedGridConfig
): any {
  const calcRow = config.gridData.filter(
    (row) => row.calcRowName === calcRowName
  );
  // at first run (init) there are no calc rows, so we can't access any field of it
  const keyAndFieldCol = methods.extractKeyAndField(columnField);
  if (calcRow.length > 0) {
    if (keyAndFieldCol.fieldName) {
      return calcRow[0][keyAndFieldCol.key][keyAndFieldCol.fieldName];
    } else {
      return calcRow[0][columnField];
    }
  } else {
    return undefined;
  }
}
