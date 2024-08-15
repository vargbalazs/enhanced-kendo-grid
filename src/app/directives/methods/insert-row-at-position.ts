import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// inserts a row at a given position
export function insertRowAtPosition(
  config: EnhancedGridConfig,
  index: number,
  calcRow: CalculatedRow
) {
  // create a copy of the last row and override the values
  let rowData = structuredClone(config.gridData[index]);
  // if we want to insert a row at position 0
  if (index === -1) {
    rowData = structuredClone(config.gridData[0]);
  }
  // write the title of the calculated row
  // if titleField is an object
  if (config.rowCalculation.titleField.includes('.')) {
    const key = config.rowCalculation.titleField.substring(
      0,
      config.rowCalculation.titleField.indexOf('.')
    );
    const fieldName = config.rowCalculation.titleField.substring(
      config.rowCalculation.titleField.indexOf('.') + 1
    );
    rowData[key][fieldName] = calcRow.title;
  } else {
    rowData[config.rowCalculation.titleField] = calcRow.title;
  }
  // mark the row as calculated
  rowData.calculated = true;
  // add the unique name
  rowData.calcRowName = calcRow.name;
  // remove the field 'dataRowIndex' from the row - this is needed, because otherwise if we delete the cell content and then hit escape or click away, also the calc row and corresponding cell goes into edit mode and the cell value gets written back also in this cell in the calc row
  delete rowData.dataRowIndex;
  // insert the row
  if (calcRow.align === 'top') {
    config.gridData.splice(index, 0, rowData);
  } else {
    config.gridData.splice(index + 1, 0, rowData);
  }
}
