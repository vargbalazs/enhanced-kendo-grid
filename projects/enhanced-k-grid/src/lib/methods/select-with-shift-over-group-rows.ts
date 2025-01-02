import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';
import * as methods from './index';

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
  // get the row indexes of the actual cell and of the calc row
  const cellDataRowIndex = +target.parentElement?.getAttribute(
    'data-kendo-grid-item-index'
  )!;
  const calcRowDataRowIndex = +(<HTMLElement>config.gridElRef.nativeElement)
    .querySelector(`[kendogridlogicalrow].${calcRowName}`)!
    .getAttribute('data-kendo-grid-item-index')!;
  // if the cell row index is less than the calc row index, then the calc row is bottom aligned, else top aligned
  const rowAlign = cellDataRowIndex < calcRowDataRowIndex ? 'bottom' : 'top';
  let nextCalcRow: Element = document.createElement('div');
  let rowIndex = 0;
  // get the next calcrow
  nextCalcRow = <HTMLElement>(
    methods.getNextVisibleCalcRow(calcRowDataRowIndex, config, e, rowAlign)
  );
  // get the row index of this next calc row
  rowIndex = +nextCalcRow.getAttribute('data-kendo-grid-item-index')!;
  // the new target will be from this row
  target = nextCalcRow?.querySelector(
    `td[data-kendo-grid-column-index="${config.lastSelectedCell.columnKey}"]`
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
  // the logical row index includes also the header, that's why we add 1 to the datarow index
  const logicalRowIndex =
    +nextCalcRow?.getAttribute('data-kendo-grid-item-index')! + 1;
  if (e.key === ARROWS.DOWN) {
    grid.focusCell(logicalRowIndex - 1, grid.activeCell.colIndex);
  } else {
    grid.focusCell(logicalRowIndex + 1, grid.activeCell.colIndex);
  }

  return target;
}
