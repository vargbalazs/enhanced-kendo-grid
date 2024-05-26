import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { fromEvent } from 'rxjs';

// add mousedown eventlistener to the header, because if sorting is enabled and if we are editing, we have to prevent sorting
export function handleSorting(config: EnhancedGridConfig, grid: GridComponent) {
  const headerCells = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelectorAll('.k-grid-header th');
  config.columnClick$ = fromEvent(headerCells, 'mousedown').subscribe((e) => {
    // first try to close it
    grid.closeCell();
    // if cell can't be closed, then we are still in edit mode, so no sorting allowed
    grid.sortable = !grid.isEditing();
  });
}
