import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// inserts calculated rows based on a field and it's value
export function insertCalcRowsByField(
  config: EnhancedGridConfig,
  calcRow: CalculatedRow
) {
  // find the index, where the calculated row has to be inserted
  let lastIndex = -1;
  for (let i = config.gridData.length - 1; i >= 0; i--) {
    if (
      config.gridData[i][calcRow.calculateByField?.fieldName!] ===
      calcRow.calculateByField?.fieldValue
    ) {
      lastIndex = i;
      break;
    }
  }
  // create a copy of the last row and override the values
  const rowData = structuredClone(config.gridData[lastIndex]);
  // write the title of the calculated row
  // if titleField is an object
  if (config.rowCalculation.titleField.includes('.')) {
    const key = config.rowCalculation.titleField.substring(
      0,
      config.rowCalculation.titleField.indexOf('.')
    );
    const fieldName = config.rowCalculation.titleField.substring(
      config.rowCalculation.titleField.indexOf('.') + 1
    );
    rowData[key][fieldName] = calcRow.title;
  } else {
    rowData[config.rowCalculation.titleField] = calcRow.title;
  }
  // mark the row as calculated
  rowData.calculated = true;
  // add the unique name
  rowData.calcRowName = calcRow.name;
  // insert the row
  config.gridData.splice(lastIndex + 1, 0, rowData);
}
