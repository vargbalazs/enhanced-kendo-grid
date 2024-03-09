import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { RowCalculation } from '../interfaces/row-calculation.interface';
import * as methods from './index';

// inserts the calculated rows into the grid data
export function insertCalculatedRows(
  rowCalculation: RowCalculation,
  config: EnhancedGridConfig,
  grid: GridComponent
) {
  // pass the styling callback to the grid
  grid.rowClass = rowCallback;
  // store all the custom classes
  const customCssClasses: string[] = [];
  rowCalculation.calculatedRows.forEach((calcRow) => {
    if (calcRow.cssClass) customCssClasses.push(calcRow.cssClass);
  });
  rowCalculation.calculatedRows.forEach((calcRow) => {
    // if a field was defined
    if (calcRow.calculateByField)
      methods.insertCalcRowsByField(config, calcRow);
  });
  // set the styles for the calc rows
  // we need setTimeout in order to have the data changes reflected in the dom
  setTimeout(() => {
    methods.styleCalculatedRows(config, customCssClasses);
  });
}

// callback for styling calculated rows
function rowCallback(context: RowClassArgs) {
  if (context.dataItem.calculated)
    return { calcrow: true, [context.dataItem.calcRowName]: true };
  return '';
}
