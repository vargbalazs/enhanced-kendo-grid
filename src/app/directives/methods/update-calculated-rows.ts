import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

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
      let key = '';
      let fieldName = '';
      // if calcField is an object
      if (calcField.includes('.')) {
        key = calcField.substring(0, calcField.indexOf('.'));
        fieldName = calcField.substring(calcField.indexOf('.') + 1);
      } else {
        key = calcField;
      }
      // filter the data
      const filteredData = config.gridData.filter(
        (dataRow) =>
          dataRow[calcRow.calculateByField!.fieldName] ===
            calcRow.calculateByField!.fieldValue && !dataRow.calculated
      );
      // do the calculations
      let result = 0;
      switch (calcRow.calculateFunction) {
        case 'sum':
          result = filteredData.reduce(
            (acc, rowData) =>
              fieldName ? acc + +rowData[key][fieldName] : acc + +rowData[key],
            0
          );
          break;
        case 'avg':
          let countOfNumberValues = 0;
          const sum = filteredData.reduce(
            (acc, rowData) =>
              fieldName ? acc + +rowData[key][fieldName] : acc + +rowData[key],
            0
          );
          if (fieldName) {
            filteredData.map((rowData) => {
              if (isFinite(+rowData[fieldName][key])) countOfNumberValues++;
            });
          } else {
            filteredData.map((rowData) => {
              if (isFinite(+rowData[key])) countOfNumberValues++;
            });
          }
          result = countOfNumberValues > 0 ? sum / countOfNumberValues : 0;
          break;
        case 'min':
          if (fieldName) {
            result = +filteredData.reduce((prev, curr) =>
              +prev[key][fieldName] < +curr[key][fieldName] ? prev : curr
            )[key][fieldName];
          } else {
            result = +filteredData.reduce((prev, curr) =>
              +prev[key] < +curr[key] ? prev : curr
            )[key];
          }
          break;
        case 'max':
          if (fieldName) {
            result = +filteredData.reduce((prev, curr) =>
              +prev[key][fieldName] > +curr[key][fieldName] ? prev : curr
            )[key][fieldName];
          } else {
            result = +filteredData.reduce((prev, curr) =>
              +prev[key] > +curr[key] ? prev : curr
            )[key];
          }
          break;
        case 'count':
          result = filteredData.length;
          break;
      }
      // write the calculated value back
      if (fieldName) {
        config.gridData[calcRowIndex][key][fieldName] = result;
      } else {
        config.gridData[calcRowIndex][key] = result;
      }
    });
  });
}
