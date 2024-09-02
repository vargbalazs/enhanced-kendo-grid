import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// gets the child row indexes of all parent rows to the max deep and stores it
// the 'filteredData' argument contains already the child rows, but only the direct ones
export function getChildRowIndexes(
  config: EnhancedGridConfig,
  calcRow: CalculatedRow,
  filteredData: any[]
): number[] {
  // define empty array for the indexes
  const rowIndexes: number[] = [];
  // process 'filteredData'
  for (let i = 0; i <= filteredData.length - 1; i++) {
    const row = filteredData[i];
    // if the filteredData row is a calculated one, then search for it differently
    if (row.calculated) {
      const gridRow = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector(`[kendogridlogicalrow].${row.calcRowName}`);
      const rowIndex = +gridRow?.getAttribute('ng-reflect-data-row-index')!;
      rowIndexes.push(rowIndex);
      // search for any child calculated rows
      const childCalcRows = config.rowCalculation.calculatedRows.forEach(
        (r) => r.parentRowName === row.calcRowName
      );
      console.log(childCalcRows);
    } else {
      // if not, then search the grid data
      const rowIndex = config.gridData.findIndex(
        (dataRow) => dataRow.dataRowIndex === row.dataRowIndex
      );
      rowIndexes.push(rowIndex);
    }
  }
  if (calcRow.name === 'calcsum-total') {
    console.log(rowIndexes);
  }

  return rowIndexes;
}
