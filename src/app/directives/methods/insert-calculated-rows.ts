import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
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
    // insert the row
    gridData.splice(lastIndex + 1, 0, rowData);

    // set the style of the unused fields
    // we need setTimeout in order to have the data changes reflected in the dom
    setTimeout(() => {
      const gridBody = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector('[kendogridtablebody]');
      for (let i = 0; i <= config.columns.length - 1; i++) {
        if (
          config.columns[i].field !== calcRow.title.writeToField &&
          !calcRow.calculatedFields.includes(config.columns[i].field)
        ) {
          let target = gridBody!.querySelector(
            `[ng-reflect-data-row-index="${
              lastIndex + 1
            }"][ng-reflect-col-index="${i}"]`
          );
          target?.classList.add('calcrow-unused-cell');
        }
      }
    });
  });
}
