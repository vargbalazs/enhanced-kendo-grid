import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';
import { ARROWS, ARROW_KEYS } from '../consts/constants';
import { Renderer2 } from '@angular/core';

// select cells holding the shift key
export function selectWithShift(
  e: KeyboardEvent,
  grid: GridComponent,
  config: EnhancedGridConfig,
  resetFn: () => void,
  updateFn: () => void,
  renderer2: Renderer2
) {
  // if we move back from the header row, we can only move back to the same column index, which we had
  // when we moved to the header row, otherwise we cancel the selection
  if (
    e.shiftKey &&
    e.key === ARROWS.DOWN &&
    isHeaderCell(e.target) //grid.activeCell.dataRowIndex === -1
  ) {
    if (
      grid.activeCell.colIndex != methods.getLastSelectedCell(config)?.columnKey
    ) {
      // if the grid is grouped, then return
      //if (config.groupedGridData.length > 0) return;
      resetFn();
    }
  }

  // if we aren't in edit mode and hold the shift key and press any arrow (selecting)
  if (
    !grid.isEditingCell() &&
    e.shiftKey &&
    ARROW_KEYS.includes(e.key) &&
    !isHeaderCell(e.target) &&
    !isFilterCell(e.target) &&
    !isGroupCell(e.target) //grid.activeCell.dataRowIndex != -1 // not header or group row
  ) {
    // if we copied something to the clipboard, then cancel the copying
    if (config.dataCopied) {
      renderer2.removeClass(config.selectedArea, 'dashed-border');
      renderer2.removeClass(config.firstSelectedCellElement, 'no-focus-shadow');
      config.dataCopied = false;
    }

    // store the td element
    let target = <HTMLElement>e.target;
    // store the grid element
    const gridBody = target.parentElement?.parentElement;
    config.gridBody = gridBody!;

    // store the first selected cell, it's position and it's value
    if (config.selectedCells.length === 0) {
      // the cell itself
      config.selectedCells.push({
        itemKey: grid.activeCell.dataRowIndex,
        columnKey: grid.activeCell.colIndex,
      });
      Object.assign(config.firstSelectedCell, config.selectedCells[0]);

      // it's position
      methods.setRectValues(config.firstSelectedCellRect, target, config);

      // it's value
      // get the column field name
      config.fieldName = config.columns[grid.activeCell.colIndex].field;
      // if in the cell we have an object
      if (config.fieldName.includes('.')) {
        const objectKey = config.fieldName.substring(
          0,
          config.fieldName.indexOf('.')
        );
        const propertyKey = config.fieldName.substring(
          config.fieldName.indexOf('.') + 1
        );
        config.selectedCellDatas.push({
          value: grid.activeCell.dataItem[objectKey][propertyKey],
        });
      } else
        config.selectedCellDatas.push({
          value: grid.activeCell.dataItem[config.fieldName],
        });
      // don't consider values from cells in case of calcualted rows, which aren't calculated fields (which are 'hidden')
      if (
        grid.activeCell.dataItem.calculated &&
        !config.rowCalculation.calculatedFields.includes(config.fieldName) &&
        config.rowCalculation.titleField !== config.fieldName
      ) {
        config.selectedCellDatas[0].value = '';
      }
    }

    // pressing the arrow keys
    switch (e.key) {
      case ARROWS.RIGHT:
        // exit if we reach one of the edges
        if (methods.rightEndReached(grid)) return;
        config.lastSelectedCell = {
          itemKey: grid.activeCell.dataRowIndex,
          columnKey: grid.activeCell.colIndex + 1,
        };
        break;
      case ARROWS.LEFT:
        // exit if we reach one of the edges
        if (methods.leftEndReached(grid)) return;
        config.lastSelectedCell = {
          itemKey: grid.activeCell.dataRowIndex,
          columnKey: grid.activeCell.colIndex - 1,
        };
        break;
      case ARROWS.UP:
        // exit if we reach one of the edges
        if (methods.topEndReached(grid)) return;
        config.lastSelectedCell = {
          itemKey: grid.activeCell.dataRowIndex - 1,
          columnKey: grid.activeCell.colIndex,
        };
        break;
      case ARROWS.DOWN:
        // exit if we reach one of the edges
        if (methods.bottomEndReached(grid)) return;
        config.lastSelectedCell = {
          itemKey: grid.activeCell.dataRowIndex + 1,
          columnKey: grid.activeCell.colIndex,
        };
        break;
    }

    // query for the last sel. cell and override target, because the target of the keydown event isn't the last sel. cell
    target = gridBody!.querySelector(
      `[ng-reflect-data-row-index="${config.lastSelectedCell.itemKey}"][ng-reflect-col-index="${config.lastSelectedCell.columnKey}"]`
    )!;
    // store the position of the last selected cell
    methods.setRectValues(config.lastSelectedCellRect, target, config);

    // mark the cells as selected and update the state only if we move to another cell
    if (
      config.rowIndex != config.lastSelectedCell.itemKey ||
      config.colIndex != config.lastSelectedCell.columnKey
    ) {
      methods.markCellsAsSelected(config, grid);
      methods.calculateAggregates(config);
      updateFn();

      // set the indexes to the indexes of the last selected cell
      config.rowIndex = config.lastSelectedCell.itemKey;
      config.colIndex = config.lastSelectedCell.columnKey;

      // update also the selected area
      methods.resizeSelectedArea(config);

      // set the border and shadow of the selected area
      config.selectedArea.style.border = config.selectedAreaBorder;
      config.selectedArea.style.boxShadow = config.selectedAreaBoxShadow;
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
