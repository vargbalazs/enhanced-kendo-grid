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
  // the 'filteredData' array contains already the 2. level group rows
  // first we take care of the not calculated rows, because later we have to add the row indexes of this rows to the appr. row indexes of the appr. parent row
  for (let i = 0; i <= filteredData.length - 1; i++) {
    const row = filteredData[i];
    if (!row.calculated) {
      // loop through the grid data to get the row index
      const rowIndex = config.gridData.findIndex(
        (dataRow) => dataRow.dataRowIndex === row.dataRowIndex
      );
      rowIndexes.push(rowIndex);
    }
  }
  config.rowCalculation.calculatedRows.find(
    (row) => row.name === calcRow.name
  )!.rowIndexes = rowIndexes;
  for (let i = 0; i <= filteredData.length - 1; i++) {
    const row = filteredData[i];
    // if the filteredData row is a calculated one, then search for the row index differently
    if (row.calculated) {
      const gridRow = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector(`[kendogridlogicalrow].${row.calcRowName}`);
      const rowIndex = +gridRow?.getAttribute('ng-reflect-data-row-index')!;
      rowIndexes.push(rowIndex);
      // search for any child calculated rows
      // this rows will be on group level 3
      const childCalcRows = config.rowCalculation.calculatedRows.filter(
        (r) => r.parentRowName === row.calcRowName
      );
      if (childCalcRows.length > 0) {
        // if we have some, then add this indexes too
        childCalcRows.forEach((childCalcRow) => {
          const gridRow = (<HTMLElement>(
            config.gridElRef.nativeElement
          )).querySelector(`[kendogridlogicalrow].${childCalcRow.name}`);
          const rowIndex = +gridRow?.getAttribute('ng-reflect-data-row-index')!;
          rowIndexes.push(rowIndex);
          // get the already stored row indexes for each child row and add to the existing ones
          const calcRow = config.rowCalculation.calculatedRows.find(
            (calcRow) => calcRow.name === childCalcRow.name
          );
          rowIndexes.push(...calcRow?.rowIndexes!);
        });
      } else {
        // get the already stored row indexes for the processed row and add to the existing ones
        const calcRow = config.rowCalculation.calculatedRows.find(
          (calcRow) => calcRow.name === row.calcRowName
        );
        rowIndexes.push(...calcRow?.rowIndexes!);
      }
    }
  }

  return rowIndexes.sort((a, b) => {
    return a - b;
  });
}
