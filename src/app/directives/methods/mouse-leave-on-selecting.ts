import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// if we move out of the table we set everything to default
export function mouseLeaveOnSelecting(
  e: MouseEvent,
  config: EnhancedGridConfig,
  resetFn: () => void,
  grid: GridComponent,
  updateFn: () => void
) {
  const gridContent = (<HTMLElement>(
    config.gridElRef.nativeElement
  )).querySelector('.k-grid-content')!;

  // if we are selecting and we left the grid on the right side, then repeatedly select the next column of cells and scroll the grid
  if (
    config.isMouseDown &&
    e.pageX > gridContent.getBoundingClientRect().right
  ) {
    config.intervalId = window.setInterval(() => {
      if (config.lastSelectedCell.columnKey < config.columns.length - 1) {
        // store the last selected cell and it's position
        config.lastSelectedCell = {
          itemKey: config.lastSelectedCell.itemKey,
          columnKey: config.lastSelectedCell.columnKey + 1,
        };

        selectCells(config, grid, updateFn);

        gridContent?.scrollBy({
          left: config.columns[config.lastSelectedCell.columnKey].width,
          behavior: 'smooth',
        });
      }
    }, 300);
  }

  // if we are selecting and we left the grid on the bottom side, then repeatedly select the next row of cells and scroll the grid
  if (
    config.isMouseDown &&
    e.pageY > gridContent.getBoundingClientRect().bottom
  ) {
    config.intervalId = window.setInterval(() => {
      if (config.lastSelectedCell.itemKey < config.gridData.length - 1) {
        // store the last selected cell and it's position
        config.lastSelectedCell = {
          itemKey: config.lastSelectedCell.itemKey + 1,
          columnKey: config.lastSelectedCell.columnKey,
        };

        selectCells(config, grid, updateFn);

        gridContent?.scrollBy({
          top: 20,
          behavior: 'smooth',
        });
      } else {
        gridContent?.scrollBy({
          top: gridContent.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 300);
  }
}

function selectCells(
  config: EnhancedGridConfig,
  grid: GridComponent,
  updateFn: () => void
) {
  let target = <HTMLElement>(
    config.gridBody.querySelector(
      `[ng-reflect-data-row-index="${config.lastSelectedCell.itemKey}"][ng-reflect-col-index="${config.lastSelectedCell.columnKey}"]`
    )
  );
  methods.setRectValues(config.lastSelectedCellRect, target, config);
  methods.markCellsAsSelected(config, grid);
  methods.calculateAggregates(config);

  // update only, if we are in another cell
  if (config.selectedCells.length >= 1) updateFn();

  // set the indexes to the indexes of the last selected cell
  config.rowIndex = config.lastSelectedCell.itemKey;
  config.colIndex = config.lastSelectedCell.columnKey;

  // update also the selected area
  methods.resizeSelectedArea(config);

  // if there are some frozen columns
  if (config.frozenColumns.length > 0) {
    methods.scrollToColumnMouse(config);
  }
}
