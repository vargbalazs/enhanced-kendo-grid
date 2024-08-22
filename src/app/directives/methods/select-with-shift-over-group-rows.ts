import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';

// handles the cases where we are selecting with shift over group rows and presses up or down keys
export function selectWithShiftOverGroupRows(
  config: EnhancedGridConfig,
  target: HTMLElement,
  grid: GridComponent,
  e: KeyboardEvent
): HTMLElement {
  // jump to the next visible row
  // this will be either the next calculated row or the end
  // if we are in the last calcrow and it is collapsed, then stay in the calc row on down key, because in the view this is the last row
  // if we want to select the rows below it, then the user should simply expand the calc row
  // the parent of the parent of the target will be the div with the attribute calclrow=calcrowname
  const calcRowName =
    target.parentElement!.parentElement?.getAttribute('calcrowname');
  // get the calcrow index
  const calcRowIndex = config.rowCalculation.calculatedRows.findIndex(
    (calcRow) => calcRow.name === calcRowName
  );
  let nextCalcRowName = '';
  let nextCalcRow: Element = document.createElement('div');
  let rowIndex = 0;
  switch (e.key) {
    case ARROWS.DOWN:
      // if we have at least one calcrow left
      if (calcRowIndex < config.rowCalculation.calculatedRows.length - 1) {
        nextCalcRowName =
          config.rowCalculation.calculatedRows[calcRowIndex + 1].name;
      } else {
        // take the last one
        nextCalcRowName = config.rowCalculation.calculatedRows.at(-1)!.name;
      }
      break;
    case ARROWS.UP:
      // if we have at least one calcrow left
      if (calcRowIndex > 0) {
        nextCalcRowName =
          config.rowCalculation.calculatedRows[calcRowIndex].name;
      } else {
        // take the first one
        nextCalcRowName = config.rowCalculation.calculatedRows[0].name;
      }
      break;
  }
  // get the next calcrow
  nextCalcRow = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
    `[kendogridlogicalrow].${nextCalcRowName}`
  )!;
  // get the row index of this next calc row
  rowIndex = +nextCalcRow?.getAttribute('ng-reflect-data-row-index')!;
  // the new target will be from this row
  target = nextCalcRow?.querySelector(
    `td[ng-reflect-col-index="${config.lastSelectedCell.columnKey}"]`
  )!;
  // if we are selecting with shift, then we have to change also the last selected cell
  if (e.shiftKey) {
    // set the last selected cell accordingly
    config.lastSelectedCell = {
      itemKey: rowIndex,
      columnKey: grid.activeCell.colIndex,
    };
  }
  // set also the focused cell
  const logicalRowIndex = +nextCalcRow?.getAttribute(
    'ng-reflect-logical-row-index'
  )!;
  if (e.key === ARROWS.DOWN) {
    grid.focusCell(logicalRowIndex - 1, grid.activeCell.colIndex);
  } else {
    grid.focusCell(logicalRowIndex + 1, grid.activeCell.colIndex);
  }

  return target;
}
