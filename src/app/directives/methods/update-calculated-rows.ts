import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import {
  ConditionalRowRange,
  SimpleRowRange,
} from '../interfaces/calculated-row.interface';
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
      let filteredData: any[] = [];
      // if the row is calculated by a field
      if (calcRow.calculateByField) {
        filteredData = config.gridData.filter(
          (dataRow) =>
            dataRow[calcRow.calculateByField!.fieldName] ===
              calcRow.calculateByField!.fieldValue && !dataRow.calculated
        );
      }
      // if the row is inserted by defining it's position
      if (calcRow.position) {
        // by default we do the given calculation for all the rows above this position
        filteredData = config.gridData.slice(0, calcRow.position);
        // if calculateByRows has a value, then do the calcs based on this
        if (calcRow.calculateByRows) {
          filteredData = [];
          // if we have row names as string array
          if (Array.isArray(calcRow.calculateByRows)) {
            // loop through the array and get the row indexes and data for the calculations
            for (let i = 0; i <= calcRow.calculateByRows.length - 1; i++) {
              const rowIndex = config.gridData.findIndex(
                (dataRow) =>
                  dataRow.calcRowName === (<string[]>calcRow.calculateByRows)[i]
              );
              filteredData.push(config.gridData[rowIndex]);
            }
          } else {
            let from = 0;
            let to = 0;
            // if we have a SimpleRowRange
            if (isSimpleRowRange(calcRow.calculateByRows)) {
              from = calcRow.calculateByRows.from;
              to = calcRow.calculateByRows.to;
            } else {
              // we have a ConditionalRowRange
              let condRowRange = calcRow.calculateByRows;
              const fromKeyAndField = methods.extractKeyAndField(
                condRowRange.from.field
              );
              if (fromKeyAndField.fieldName) {
                from = config.gridData.findIndex(
                  (row) =>
                    row[fromKeyAndField.key][fromKeyAndField.fieldName!] ===
                    condRowRange.from.value
                );
              } else {
                from = config.gridData.findIndex(
                  (row) => row[fromKeyAndField.key] === condRowRange.from.value
                );
              }
              const toKeyAndField = methods.extractKeyAndField(
                condRowRange.to.field
              );
              if (toKeyAndField.fieldName) {
                to = config.gridData.findIndex(
                  (row) =>
                    row[toKeyAndField.key][toKeyAndField.fieldName!] ===
                    condRowRange.to.value
                );
              } else {
                to = config.gridData.findIndex(
                  (row) => row[toKeyAndField.key] === condRowRange.to.value
                );
              }
            }
            // collect the data
            for (let i = from; i <= to; i++) {
              filteredData.push(config.gridData[i]);
            }
          }
        }
      }
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

function isSimpleRowRange(
  range: SimpleRowRange | ConditionalRowRange
): range is SimpleRowRange {
  return typeof range.from == 'number';
}
