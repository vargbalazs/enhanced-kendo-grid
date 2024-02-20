import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { CalculatedRow } from '../interfaces/calculated-row.interface';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// inserts the calculated rows into the grid data
export function insertCalculatedRows(
  calculatedRows: CalculatedRow[],
  gridData: any[],
  grid: GridComponent,
  config: EnhancedGridConfig
) {
  calculatedRows.forEach((calcRow) => {
    // find the index, where the calculated row has to be inserted
    let lastIndex = -1;
    for (let i = gridData.length - 1; i >= 0; i--) {
      if (
        gridData[i][calcRow.calculateByField?.fieldName!] ===
        calcRow.calculateByField?.fieldValue
      ) {
        lastIndex = i;
        break;
      }
    }
    // create a copy of the last row and override the values
    const rowData = structuredClone(gridData[lastIndex]);
    // write the title of the calculated row
    // if writeToField is an object
    if (calcRow.title.writeToField.includes('.')) {
      const key = calcRow.title.writeToField.substring(
        0,
        calcRow.title.writeToField.indexOf('.')
      );
      const fieldName = calcRow.title.writeToField.substring(
        calcRow.title.writeToField.indexOf('.') + 1
      );
      rowData[key][fieldName] = calcRow.title.value;
    } else {
      rowData[calcRow.title.writeToField] = calcRow.title.value;
    }
    // mark the row as calculated
    rowData.calculated = true;
    // insert the row
    gridData.splice(lastIndex + 1, 0, rowData);
    // set the style of the unused fields
    // we need setTimeout in order to have the data changes reflected in the dom
    setTimeout(() => {
      for (let i = 0; i <= config.columns.length - 1; i++) {
        if (
          config.columns[i].field !== calcRow.title.writeToField &&
          !calcRow.calculatedFields.includes(config.columns[i].field)
        ) {
          // get the existing cssClass property of the column
          let cssClass = config.columns[i].cssClass;
          // add the existing css class or classes to an array
          const cssClasses: string[] = [];
          if (cssClass && typeof cssClass === 'string')
            cssClasses.push(cssClass);
          if (cssClass && Array.isArray(cssClass)) cssClasses.push(...cssClass);
          // add the custom class
          cssClasses.push('hide-value');
          // overwrite the cssClass property with the new array
          config.columns[i].cssClass = cssClasses;
        }
      }
    });
  });
  // pass the styling callback to the grid
  grid.rowClass = rowCallback;
}

// callback for styling the unused cells in a calculated row
function rowCallback(context: RowClassArgs) {
  if (context.dataItem.calculated) return { 'calcrow-unused-cell': true };
  return '';
}
