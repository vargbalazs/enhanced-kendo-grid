import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { RowCalculation } from '../interfaces/row-calculation.interface';

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
    if (rowCalculation.titleField.includes('.')) {
      const key = rowCalculation.titleField.substring(
        0,
        rowCalculation.titleField.indexOf('.')
      );
      const fieldName = rowCalculation.titleField.substring(
        rowCalculation.titleField.indexOf('.') + 1
      );
      rowData[key][fieldName] = calcRow.title;
    } else {
      rowData[rowCalculation.titleField] = calcRow.title;
    }
    // mark the row as calculated
    rowData.calculated = true;
    // add the unique name
    rowData.calcRowName = calcRow.name;
    // insert the row
    config.gridData.splice(lastIndex + 1, 0, rowData);
  });
  // set the styles for the calc rows
  // we need setTimeout in order to have the data changes reflected in the dom
  setTimeout(() => {
    for (let i = 0; i <= config.columns.length - 1; i++) {
      // get the existing cssClass property of the column
      const colCssClass = config.columns[i].cssClass;
      // add the existing css class or classes to an array
      const cssClasses: string[] = [];
      // set the style of the unused fields
      if (
        config.columns[i].field !== rowCalculation.titleField &&
        !rowCalculation.calculatedFields.includes(config.columns[i].field)
      ) {
        // if there is only one css class
        if (colCssClass && typeof colCssClass === 'string')
          cssClasses.push(colCssClass);
        // if there are multiple css classes
        if (colCssClass && Array.isArray(colCssClass))
          cssClasses.push(...colCssClass);
        // add the custom class
        cssClasses.push('hide-value', ...customCssClasses);
      } else {
        // if there is only one css class
        if (colCssClass && typeof colCssClass === 'string')
          cssClasses.push(colCssClass);
        // if there are multiple css classes
        if (colCssClass && Array.isArray(colCssClass))
          cssClasses.push(...colCssClass);
        // add the custom class
        cssClasses.push(...customCssClasses);
      }
      // overwrite the cssClass property with the new array
      config.columns[i].cssClass = cssClasses;
      config.columnStyles.push({ cssClasses: cssClasses, columnIndex: i });
    }
  });
}

// callback for styling calculated rows
function rowCallback(context: RowClassArgs) {
  if (context.dataItem.calculated)
    return { calcrow: true, [context.dataItem.calcRowName]: true };
  return '';
}
