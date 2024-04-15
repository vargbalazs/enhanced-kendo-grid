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
        //methods.drawSelectedAreaBorder(config);

        // override style of non-editable cells
        // methods.setNonEditableCellStyle(config, 'off');

        // if there are some frozen columns
        if (config.frozenColumns.length > 0) {
          methods.scrollToColumnMouse(config);
        }

        gridContent?.scrollBy({
          left: config.columns[config.lastSelectedCell.columnKey].width,
          behavior: 'smooth',
        });

        // console.log('belép');
      }
    }, 500);
  }

  // const target = <HTMLElement>e.target;
  // if (
  //   config.isMouseDown &&
  //   !target?.hasAttribute('ng-reflect-data-row-index')
  // ) {
  //   config.isMouseDown = false;
  //   resetFn();
  // }
}
