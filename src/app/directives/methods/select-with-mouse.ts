import { GridComponent } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// select cells with the mouse
export function selectWithMouse(
  config: EnhancedGridConfig,
  e: MouseEvent,
  grid: GridComponent,
  updateFn: () => void
) {
  e.preventDefault();
  // get the target
  const target = <HTMLElement>e.target;
  // if we move on a data cell
  if (
    target?.hasAttribute('ng-reflect-data-row-index') &&
    target?.hasAttribute('ng-reflect-col-index')
  ) {
    // store the grid body
    config.gridBody = target.parentElement!.parentElement!;
    // get the indexes
    const dataRowIndex = +target.attributes.getNamedItem(
      'ng-reflect-data-row-index'
    )!.value;
    const columnIndex = +target.attributes.getNamedItem('ng-reflect-col-index')!
      .value;

    // store the first selected cell, it's position and it's value
    if (config.selectedCells.length === 0) {
      // store the html element of the first cell
      config.firstSelectedCellElement = target;
      // the cell itself
      config.selectedCells.push({
        itemKey: grid.activeCell.dataRowIndex,
        columnKey: grid.activeCell.colIndex,
      });
      Object.assign(config.firstSelectedCell, config.selectedCells[0]);

      // it's position
      methods.setRectValues(config.firstSelectedCellRect, target);

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
        !config.rowCalculation.calculatedFields.includes(config.fieldName)
      ) {
        config.selectedCellDatas[0].value = '';
      }
    }

    // store the last selected cell and it's position
    config.lastSelectedCell = {
      itemKey: dataRowIndex,
      columnKey: columnIndex,
    };
    methods.setRectValues(config.lastSelectedCellRect, target);

    // mark the cells as selected and update the state only if we move to another cell
    if (
      config.rowIndex != config.lastSelectedCell.itemKey ||
      config.colIndex != config.lastSelectedCell.columnKey
    ) {
      // reset the selected area - with this we also remove the borders from previous selected cells
      methods.resetSelectedArea(document.createElement('div'), config);

      methods.markCellsAsSelected(config, grid);
      methods.calculateAggregates(config);

      // update only, if we are in another cell
      if (config.selectedCells.length >= 1) updateFn();

      // set the indexes to the indexes of the last selected cell
      config.rowIndex = config.lastSelectedCell.itemKey;
      config.colIndex = config.lastSelectedCell.columnKey;

      // update also the selected area
      // methods.resizeSelectedArea(config);
      methods.drawSelectedAreaBorder(config);

      // override style of non-editable cells
      methods.setNonEditableCellStyle(config, 'off');

      // if there are some frozen columns
      if (config.frozenColumns.length > 0) {
        methods.scrollToColumnMouse(config);
      }

      // override style of calculated cells, if we are in a calc grid
      if (config.calculatedGrid) methods.overrideCalculatedCellStyle(config);
    }
  }
}
