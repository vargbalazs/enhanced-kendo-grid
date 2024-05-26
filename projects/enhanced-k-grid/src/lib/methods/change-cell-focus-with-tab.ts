import { GridComponent } from '@progress/kendo-angular-grid';

// changes focus to the next/prev cell, if we hit tab
export function changeCellFocusWithTab(grid: GridComponent, e: KeyboardEvent) {
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

  // prevent the focus from moving to the next element
  e.preventDefault();
}
