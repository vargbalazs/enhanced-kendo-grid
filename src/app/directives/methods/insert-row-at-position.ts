import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// inserts a row at a given position
export function insertRowAtPosition(
  config: EnhancedGridConfig,
  index: number,
  calcRow: CalculatedRow
) {
  // create a copy of the last row and override the values
  const rowData = structuredClone(config.gridData[index]);
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
  config.gridData.splice(index + 1, 0, rowData);
}
