import * as methods from './index';

// gets the value of a given cell
// first we search the corresponding row based on the rowField and rowValue parameters
// then we get the cell value based on the columnField parameter
export function getCellValuePrivate(
  rowField: string,
  rowValue: any,
  columnField: string,
  gridData: any[],
  fromCalcRow: boolean
): any {
  const keyAndFieldRow = methods.extractKeyAndField(rowField);
  const keyAndFieldCol = methods.extractKeyAndField(columnField);
  let row: any[];
  if (keyAndFieldRow.fieldName) {
    if (fromCalcRow) {
      row = gridData.filter(
        (row) =>
          row[keyAndFieldRow.key][keyAndFieldRow.fieldName!] === rowValue &&
          row.calcRowName
      );
    } else {
      row = gridData.filter(
        (row) =>
          row[keyAndFieldRow.key][keyAndFieldRow.fieldName!] === rowValue &&
          !row.calcRowName
      );
    }
  } else {
    if (fromCalcRow) {
      row = gridData.filter(
        (row) => row[rowField] === rowValue && row.calcRowName
      );
    } else {
      row = gridData.filter(
        (row) => row[rowField] === rowValue && !row.calcRowName
      );
    }
  }
  if (keyAndFieldCol.fieldName) {
    return row[0][keyAndFieldCol.key][keyAndFieldCol.fieldName];
  } else {
    return row[0][columnField];
  }
}
