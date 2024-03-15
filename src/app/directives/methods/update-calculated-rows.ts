import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// updates the values of the calculated rows
export function updateCalculatedRows(config: EnhancedGridConfig) {
  // loop through the calculated rows
  config.rowCalculation.calculatedRows.forEach((calcRow) => {
    // get the index of the calculated row
    const calcRowIndex = config.gridData.findIndex(
      (dataRow) => dataRow.calcRowName === calcRow.name
    );
    // loop through the calculated fields
    config.rowCalculation.calculatedFields.forEach((calcField) => {
      // get key and field name
      const keyAndField = methods.extractKeyAndField(calcField);
      let key = keyAndField.key;
      let fieldName = keyAndField.fieldName ? keyAndField.fieldName : '';
      // filter the data
      let filteredData = methods.filterDataForCalculation(config, calcRow);
      // do the calculations
      let result = methods.calculateResultForCalcRow(
        calcRow,
        filteredData,
        key,
        fieldName
      );
      // write the calculated value back
      // if calcRowIndex = -1, then we have one or more rows, which we want to insert by it's position, but the
      // position is greater than the total count of the rows; in this case we would get here an error
      if (calcRowIndex != -1) {
        if (fieldName) {
          config.gridData[calcRowIndex][key][fieldName] = result;
        } else {
          config.gridData[calcRowIndex][key] = result;
        }
      }
    });
  });
}
