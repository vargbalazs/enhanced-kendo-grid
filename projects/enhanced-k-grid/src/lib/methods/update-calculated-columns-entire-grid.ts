import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// updates the calculated columns
export function updateCalculatedColumnsForEntireGrid(
  config: EnhancedGridConfig
) {
  // loop through the calc cols
  config.colCalculation.calculatedColumns.forEach((calcCol) => {
    const keyAndFieldCalcCol = methods.extractKeyAndField(calcCol.field);
    switch (calcCol.calculateFunction) {
      case 'sum':
        config.fullGridData.forEach((row) => {
          let result = 0;
          calcCol.calculateByColumns.forEach((col) => {
            const keyAndField = methods.extractKeyAndField(col);
            result += keyAndField.fieldName
              ? +row[keyAndField.key][keyAndField.fieldName]
              : +row[col];
            if (keyAndFieldCalcCol.fieldName) {
              row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] =
                result;
            } else {
              row[calcCol.field] = result;
            }
          });
        });
        break;
      case 'avg':
        config.fullGridData.forEach((row) => {
          let result = 0;
          calcCol.calculateByColumns.forEach((col) => {
            const keyAndField = methods.extractKeyAndField(col);
            result += keyAndField.fieldName
              ? +row[keyAndField.key][keyAndField.fieldName]
              : +row[col];
            if (keyAndFieldCalcCol.fieldName) {
              row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] =
                result / calcCol.calculateByColumns.length;
            } else {
              row[calcCol.field] = result / calcCol.calculateByColumns.length;
            }
          });
        });
        break;
      case 'min':
        config.fullGridData.forEach((row) => {
          let values: number[] = [];
          calcCol.calculateByColumns.forEach((col) => {
            const keyAndField = methods.extractKeyAndField(col);
            values.push(
              keyAndField.fieldName
                ? +row[keyAndField.key][keyAndField.fieldName]
                : +row[col]
            );
          });
          let result = values.reduce((prev, curr) =>
            prev < curr ? prev : curr
          );
          if (keyAndFieldCalcCol.fieldName) {
            row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] = result;
          } else {
            row[calcCol.field] = result;
          }
        });
        break;
      case 'max':
        config.fullGridData.forEach((row) => {
          let values: number[] = [];
          calcCol.calculateByColumns.forEach((col) => {
            const keyAndField = methods.extractKeyAndField(col);
            values.push(
              keyAndField.fieldName
                ? +row[keyAndField.key][keyAndField.fieldName]
                : +row[col]
            );
          });
          let result = values.reduce((prev, curr) =>
            prev > curr ? prev : curr
          );
          if (keyAndFieldCalcCol.fieldName) {
            row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] = result;
          } else {
            row[calcCol.field] = result;
          }
        });
        break;
      case 'count':
        config.fullGridData.forEach((row) => {
          if (keyAndFieldCalcCol.fieldName) {
            row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] =
              calcCol.calculateByColumns.length;
          } else {
            row[calcCol.field] = calcCol.calculateByColumns.length;
          }
        });
        break;
      case 'custom':
        config.fullGridData.forEach((row) => {
          const fg = config.cellEditingFormGroupFn({
            dataItem: row,
            isNew: false,
            rowIndex: row.dataRowIndex,
            sender: config.gridComponent,
          });
          if (keyAndFieldCalcCol.fieldName) {
            row[keyAndFieldCalcCol.key][keyAndFieldCalcCol.fieldName] =
              calcCol.customFunction!(fg, row);
          } else {
            row[calcCol.field] = calcCol.customFunction!(fg, row);
          }
        });
        break;
    }
  });
}
