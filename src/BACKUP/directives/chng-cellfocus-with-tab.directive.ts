import { Input, Directive, HostListener } from '@angular/core';

import { GridComponent } from '@progress/kendo-angular-grid';

@Directive({
  selector: '[changeCellFocusWithTab]',
})
export class ChangeCellFocusWithTabDirective {
  @Input() wrap = true;

  constructor(private grid: GridComponent) {}

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') {
      // Handle just tabs
      return;
    }

    let activeRow = this.grid.activeRow;
    if (!activeRow || !activeRow.dataItem) {
      // Not on an editable row
      return;
    }

    if (this.grid.isEditingCell() && !this.grid.closeCell()) {
      // Content validation failed, keep focus in cell
      e.preventDefault();
      return;
    }

    const nav = e.shiftKey
      ? this.grid.focusPrevCell(this.wrap)
      : this.grid.focusNextCell(this.wrap);

    if (!nav) {
      // No next cell to navigate to
      return;
    }

    // Prevent the focus from moving to the next element
    e.preventDefault();
  }
}
