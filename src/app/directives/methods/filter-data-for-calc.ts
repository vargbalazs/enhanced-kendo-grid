import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import {
  CalculatedRow,
  ConditionalRowRange,
  SimpleRowRange,
} from '../interfaces/calculated-row.interface';
import * as methods from './index';

// filters the grid data for calculation
export function filterDataForCalculation(
  config: EnhancedGridConfig,
  calcRow: CalculatedRow
): any[] {
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
  return filteredData;
}

function isSimpleRowRange(
  range: SimpleRowRange | ConditionalRowRange
): range is SimpleRowRange {
  return typeof range.from == 'number';
}
