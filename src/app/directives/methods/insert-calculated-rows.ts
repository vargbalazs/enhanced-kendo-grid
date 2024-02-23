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
  // pass the styling callback to the grid
  grid.rowClass = rowCallback;

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
    // add the row css classes
    rowData.cssClasses = calcRow.cssClass;
    // insert the row
    gridData.splice(lastIndex + 1, 0, rowData);
    // set the styles for the calc rows
    // we need setTimeout in order to have the data changes reflected in the dom
    setTimeout(() => {
      for (let i = 0; i <= config.columns.length - 1; i++) {
        // set the style of the unused fields
        if (
          config.columns[i].field !== calcRow.title.writeToField &&
          !calcRow.calculatedFields.includes(config.columns[i].field)
        ) {
          // get the existing cssClass property of the column
          const colCssClass = config.columns[i].cssClass;
          // add the existing css class or classes to an array
          const cssClasses: string[] = [];
          // if there is only one css class
          if (colCssClass && typeof colCssClass === 'string')
            cssClasses.push(colCssClass);
          // if there are multiple css classes
          if (colCssClass && Array.isArray(colCssClass))
            cssClasses.push(...colCssClass);
          // add the custom class
          cssClasses.push('hide-value');
          // overwrite the cssClass property with the new array
          config.columns[i].cssClass = cssClasses;
        } else {
          // // if we have some custom classes for the calc row itself
          // if (calcRow.cssClass) {
          //   // get the existing cssClass property of the column
          //   const colCssClass = config.columns[i].cssClass;
          //   // add the existing css class or classes to an array
          //   const cssClasses: string[] = [];
          //   // if there is only one custom css class
          //   if (typeof calcRow.cssClass === 'string') {
          //     if (colCssClass && typeof colCssClass === 'string')
          //       cssClasses.push(colCssClass, calcRow.cssClass);
          //     if (colCssClass && Array.isArray(colCssClass))
          //       cssClasses.push(...colCssClass, ...calcRow.cssClass);
          //   }
          //   // if there are multiple custom css classes
          //   if (Array.isArray(calcRow.cssClass)) {
          //     if (colCssClass && typeof colCssClass === 'string')
          //       cssClasses.push(colCssClass, ...calcRow.cssClass);
          //     if (colCssClass && Array.isArray(colCssClass))
          //       cssClasses.push(...colCssClass, ...calcRow.cssClass);
          //   }
          //   // overwrite the cssClass property with the new array
          //   config.columns[i].cssClass = cssClasses;
          // }
        }
      }
    });
  });
}

// callback for styling calculated rows
function rowCallback(context: RowClassArgs) {
  // if it is a calculated row
  if (context.dataItem.calculated) {
    // if we have only one css class
    if (typeof context.dataItem.cssClasses === 'string')
      return { calcrow: true, [context.dataItem.cssClasses]: true };
    // if we have multiple css classes
    if (Array.isArray(context.dataItem.cssClasses)) {
      const calcRowCssClasses = (<string[]>context.dataItem.cssClasses).map(
        (cssClass) => {
          return { [cssClass]: true };
        }
      );
      const result = Object.assign({ calcrow: true }, ...calcRowCssClasses);
      return result;
    }
  }
  return '';
}
