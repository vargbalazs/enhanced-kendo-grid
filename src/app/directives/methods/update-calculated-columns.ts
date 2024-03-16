import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// updates the calculated columns
export function updateCalculatedColumns(config: EnhancedGridConfig) {
  // loop through the calc cols
  config.colCalculation.calculatedColumns.forEach((calcCol) => {
    switch (calcCol.calculateFunction) {
      case 'sum':
        config.gridData.forEach((row) => {
          let result = 0;
          calcCol.calculateByColumns.forEach((col) => {
            result += +row[col];
            row[calcCol.field] = result;
          });
        });
        break;
      case 'avg':
        config.gridData.forEach((row) => {
          let result = 0;
          calcCol.calculateByColumns.forEach((col) => {
            result += +row[col];
            row[calcCol.field] = result / calcCol.calculateByColumns.length;
          });
        });
        break;
      case 'min':
        config.gridData.forEach((row) => {
          let values: number[] = [];
          calcCol.calculateByColumns.forEach((col) => {
            values.push(+row[col]);
          });
          let result = values.reduce((prev, curr) =>
            prev < curr ? prev : curr
          );
          row[calcCol.field] = result;
        });
        break;
      case 'max':
        config.gridData.forEach((row) => {
          let values: number[] = [];
          calcCol.calculateByColumns.forEach((col) => {
            values.push(+row[col]);
          });
          let result = values.reduce((prev, curr) =>
            prev > curr ? prev : curr
          );
          row[calcCol.field] = result;
        });
        break;
      case 'count':
        config.gridData.forEach((row) => {
          row[calcCol.field] = calcCol.calculateByColumns.length;
        });
        break;
    }
  });
}
