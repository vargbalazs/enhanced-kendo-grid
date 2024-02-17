import { GridComponent } from '@progress/kendo-angular-grid';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// inserts the calculated rows into the grid data
export function insertCalculatedRows(
  calculatedRows: CalculatedRow[],
  gridData: any[],
  grid: GridComponent
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
        // grid.addRow({
        //   [calcRow.title.writeToField]: calcRow.title.value,
        //   accountNumber: {},
        //   project: {},
        // });
        // grid.closeRow();
        break;
      }
    }
    // insert the row - create a copy of the last row and override the values
    const rowData: any = {};
    Object.assign(rowData, gridData[lastIndex]);
    rowData[calcRow.title.writeToField] = calcRow.title.value;
    gridData.splice(lastIndex + 1, 0, rowData);
  });
}
