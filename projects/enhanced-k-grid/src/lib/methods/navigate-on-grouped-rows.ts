// handles the cases if we press simple arrow buttons in a grouped grid

import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { ARROWS } from '../consts/constants';
import * as methods from './index';

// in this case we have to jump to the next calc row (down/up), if the source calc row is collapsed
export function navigateOnGroupedRows(
  e: KeyboardEvent,
  config: EnhancedGridConfig,
  grid: GridComponent
) {
  // if we aren't in edit mode and press down or up arrow
  if (
    !grid.isEditingCell() &&
    (e.key === ARROWS.DOWN || e.key === ARROWS.UP) &&
    !isHeaderCell(e.target) &&
    !isFilterCell(e.target) &&
    !isGroupCell(e.target)
  ) {
    // store the td element
    let target = <HTMLElement>e.target;
    // query for the last sel. cell and override target, because the target of the keydown event isn't the last sel. cell
    const direction = e.key === ARROWS.DOWN ? 1 : -1;
    target = (<HTMLElement>config.gridElRef.nativeElement).querySelector(
      `[ng-reflect-data-row-index="${
        grid.activeCell.dataRowIndex + direction
      }"][ng-reflect-col-index="${grid.activeCell.colIndex}"]`
    )!;
    if (
      // if the target cell is a hidden (collapsed) one - such cells have a 'tr' parent element with an attribute 'collapsed'
      target.parentElement?.attributes.getNamedItem('collapsed')
    ) {
      methods.selectWithShiftOverGroupRows(config, target, grid, e);
    }
  }
}

function isGroupCell(target: any) {
  return (<HTMLElement>target).hasAttribute('ng-reflect-group-item');
}

function isFilterCell(target: any) {
  return (<HTMLElement>target).hasAttribute('kendogridfiltercell');
}

function isHeaderCell(target: any) {
  return (<HTMLElement>target).role === 'columnheader';
}
