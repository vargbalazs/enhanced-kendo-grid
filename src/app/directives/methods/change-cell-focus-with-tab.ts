import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// changes focus to the next/prev cell, if we hit tab
export function changeCellFocusWithTab(
  grid: GridComponent,
  e: KeyboardEvent,
  config: EnhancedGridConfig
) {
  // handle just tabs
  if (e.key !== 'Tab') return;

  let activeRow = grid.activeRow;

  // not on an editable row
  if (!activeRow || !activeRow.dataItem) return;

  // content validation failed, keep focus in cell
  if (grid.isEditingCell() && !grid.closeCell()) {
    e.preventDefault();
    return;
  }

  const nav = e.shiftKey ? grid.focusPrevCell() : grid.focusNextCell();

  // no next cell to navigate to
  if (!nav) return;

  // get the focused cell
  const focusedCell = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector(
    `[ng-reflect-data-row-index="${nav.dataRowIndex}"][ng-reflect-col-index="${nav.colIndex}"]`
  );

  // if the next selected cell is a hidden (collapsed) one
  // such cells have a 'tr' parent element with an attribute 'collapsed'
  if (focusedCell?.parentElement?.attributes.getNamedItem('collapsed')) {
    // get the next calc row
    const calcRowName =
      focusedCell.parentElement!.parentElement?.getAttribute('calcrowname');
    // get the calcrow index
    const calcRowIndex = config.rowCalculation.calculatedRows.findIndex(
      (calcRow) => calcRow.name === calcRowName
    );
    // get the row indexes of the focused cell and of the calc row
    const cellDataRowIndex = focusedCell!.getAttribute(
      'ng-reflect-data-row-index'
    )!;
    const calcRowDataRowIndex = (<HTMLElement>config.gridElRef.nativeElement)
      .querySelector(`[kendogridlogicalrow].${calcRowName}`)!
      .getAttribute('ng-reflect-data-row-index')!;
    // if the cell row index is less than the calc row index, then the calc row is bottom aligned, else top aligned
    const rowAlign = cellDataRowIndex < calcRowDataRowIndex ? 'bottom' : 'top';
    let nextCalcRowName = '';
    if (rowAlign === 'top') {
      nextCalcRowName =
        config.rowCalculation.calculatedRows[
          e.shiftKey ? calcRowIndex : calcRowIndex + 1
        ]?.name;
    } else {
      nextCalcRowName =
        config.rowCalculation.calculatedRows[
          e.shiftKey ? calcRowIndex - 1 : calcRowIndex
        ]?.name;
    }
    // if there are a next calc row, then focus the first cell of it
    if (nextCalcRowName) {
      const nextCalcRow = (<HTMLElement>(
        config.gridElRef.nativeElement
      )).querySelector(`[kendogridlogicalrow].${nextCalcRowName}`);
      // get the logical row index of this next calc row
      const logicalRowIndex = +nextCalcRow?.getAttribute(
        'ng-reflect-logical-row-index'
      )!;
      // focus the first cell of this row
      grid.focusCell(
        logicalRowIndex,
        e.shiftKey ? config.columns.length - 1 : 0
      );
    }
  }

  // prevent the focus from moving to the next element
  e.preventDefault();
}
