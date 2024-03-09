import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// changes the style for a cell in a calculated row to selected if it is selected
export function overrideCalculatedCellStyle(config: EnhancedGridConfig) {
  // if the setup is wrong, return
  if (config.wrongCalcRowSettings) return;
  // reassign the custom classes on each and every changes of selection
  // this is needed, because if we select a calculated cell, the style is gone,
  // but if we deselect it, we need the style back
  for (let i = 0; i <= config.columns.length - 1; i++) {
    config.columns[i].cssClass = config.columnStyles[i].cssClasses;
  }
  // removes the class from a calculated cell
  for (let i = 0; i <= config.selectedCells.length - 1; i++) {
    // if the cell is in a calculated row
    if (config.gridData[config.selectedCells[i].itemKey].calculated) {
      // get the row css class based on the calc row name
      const calcRowName =
        config.gridData[config.selectedCells[i].itemKey].calcRowName;
      const cssClass = config.rowCalculation.calculatedRows
        .filter((calcRow) => calcRow.name === calcRowName)
        .at(0)?.cssClass!;
      // remove this class from the column, in which the selected cell is
      config.columns[config.selectedCells[i].columnKey].cssClass = (<string[]>(
        config.columns[config.selectedCells[i].columnKey].cssClass
      )).filter((className) => className !== cssClass);
    }
  }
}
