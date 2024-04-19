import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// marks the cells as selected in every direction
export function markCellsAsSelected(
  config: EnhancedGridConfig,
  grid: GridComponent
) {
  const firstCell = config.firstSelectedCell;
  // calculate the ranges
  const rowOffset = Math.abs(
    firstCell.itemKey - config.lastSelectedCell.itemKey
  );
  const columnOffset = Math.abs(
    firstCell.columnKey - config.lastSelectedCell.columnKey
  );
  // calculate the directions
  const verticalDirection =
    firstCell.itemKey < config.lastSelectedCell.itemKey ? 1 : -1;
  const horizontalDirection =
    firstCell.columnKey < config.lastSelectedCell.columnKey ? 1 : -1;
  // we always start with the first selected cell, because we can not only add, but remove too
  config.selectedCells = [firstCell];
  config.selectedCellDatas = [config.selectedCellDatas[0]];
  // if the next cell isn't selected, then add it to the selected cells and it's value to the selected cell datas
  for (let i = 0; i <= columnOffset; i++) {
    for (let j = 0; j <= rowOffset; j++) {
      if (
        !methods.cellIsSelected(
          {
            itemKey: firstCell.itemKey + j * verticalDirection,
            columnKey: firstCell.columnKey + i * horizontalDirection,
          },
          config.selectedCells
        )
      ) {
        config.selectedCells = [
          ...config.selectedCells,
          {
            itemKey: firstCell.itemKey + j * verticalDirection,
            columnKey: firstCell.columnKey + i * horizontalDirection,
          },
        ];
        let fieldname =
          config.columns[firstCell.columnKey + i * horizontalDirection].field;
        let value: string | number;
        // if the field is an object
        if (fieldname.includes('.')) {
          const objectKey = fieldname.substring(0, fieldname.indexOf('.'));
          const propertyKey = fieldname.substring(fieldname.indexOf('.') + 1);
          value =
            config.gridData[
              firstCell.itemKey -
                (grid.skip ? grid.skip : 0) +
                j * verticalDirection
            ][objectKey][propertyKey];
          // if the grid is filtered or sorted, we have to work with the filtered data
          // we don't have to care about calculated rows, because filtering and sorting isn't allowed on calculated grids
          if (grid.filter?.filters || grid.sort!.length > 0) {
            // if the grid is grouped
            let filteredGridData = [];
            if (config.groupedGridData.length > 0) {
              filteredGridData = methods.flattenGroupedData(
                (<GridDataResult>grid.data).data
              );
            } else {
              filteredGridData = (<GridDataResult>grid.data).data;
            }
            value =
              filteredGridData[
                firstCell.itemKey -
                  (grid.skip ? grid.skip : 0) +
                  j * verticalDirection
              ][objectKey][propertyKey];
          }
        } else {
          value =
            config.gridData[
              firstCell.itemKey -
                (grid.skip ? grid.skip : 0) +
                j * verticalDirection
            ][fieldname];
          // if the grid is filtered or sorted, we have to work with the filtered data
          // we don't have to care about calculated rows, because filtering and sorting isn't allowed on calculated grids
          if (grid.filter?.filters || grid.sort!.length > 0) {
            // if the grid is grouped
            let filteredGridData = [];
            if (config.groupedGridData.length > 0) {
              filteredGridData = methods.flattenGroupedData(
                (<GridDataResult>grid.data).data
              );
            } else {
              filteredGridData = (<GridDataResult>grid.data).data;
            }
            value =
              filteredGridData[
                firstCell.itemKey -
                  (grid.skip ? grid.skip : 0) +
                  j * verticalDirection
              ][fieldname];
          }
        }
        // don't consider values from cells in case of calcualted rows, which aren't calculated fields (which are 'hidden')
        if (
          config.gridData[
            firstCell.itemKey -
              (grid.skip ? grid.skip : 0) +
              j * verticalDirection
          ].calculated &&
          !config.rowCalculation.calculatedFields.includes(fieldname) &&
          config.rowCalculation.titleField !== fieldname
        ) {
          value = '';
        }
        config.selectedCellDatas = [
          ...config.selectedCellDatas,
          {
            value: value,
          },
        ];
      }
    }
  }
}
