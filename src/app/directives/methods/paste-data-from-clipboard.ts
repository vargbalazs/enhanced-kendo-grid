import { GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// paste data from clipboard (from excel)
export function pasteFromClipboard(
  e: KeyboardEvent,
  config: EnhancedGridConfig,
  grid: GridComponent,
  updateFn: () => void
) {
  if (e.ctrlKey && e.key === 'v') {
    navigator.clipboard.readText().then((text) => {
      if (text) {
        // lines from excel end with \r\n
        const lines = text.split('\r\n');
        // get the cell values
        const values: string[][] = [];
        // we go to length - 2, because the last element is always empty
        for (let i = 0; i <= lines.length - 2; i++) {
          values.push(lines[i].split('\t'));
        }
        // get the column count of the copied data
        const copiedColumnCount = values[0].length;
        // get the total column count of the grid
        const totalGridColumnCount = config.columns.length;
        // set the focused cell
        let focusedCell = grid.activeCell;
        // if paging is enabled, we have to adjust the dataRowIndex
        focusedCell.dataRowIndex = grid.skip
          ? focusedCell.dataRowIndex - grid.skip
          : focusedCell.dataRowIndex;
        // iterate over the copied data
        for (let i = 0; i <= copiedColumnCount - 1; i++) {
          for (let j = 0; j <= values.length - 1; j++) {
            const dataItem = config.gridData[focusedCell.dataRowIndex + j];
            // if we are in the grid
            if (
              dataItem &&
              focusedCell.colIndex + i <= totalGridColumnCount - 1
            ) {
              // if we are editing, then we have to write all the data in one cell (even if it makes no sense
              // for datas copied from multiple cells); else we write the cell datas in the appr. cell
              if (!grid.isEditing()) {
                // write the values into the grid
                const field = Object.keys(dataItem)[focusedCell.colIndex + i];
                // if the field is an object, we have to modify the appr. property
                // in case of object fields we do nothing, because they have they own data sources
                // and we had to modify this datasource with the new pasted value
                if (typeof dataItem[field] == 'object') {
                  // const columnField =
                  //   config.columns[focusedCell.colIndex + i].field;
                  // const property = columnField.substring(
                  //   columnField.indexOf('.') + 1
                  // );
                  // config.gridData[focusedCell.dataRowIndex + j][
                  //   Object.keys(dataItem)[focusedCell.colIndex + i]
                  // ][property] = values[j][i];
                } else {
                  const columnField =
                    config.columns[focusedCell.colIndex + i].field;
                  // Object.keys doesn't contain columns derived from objects, that's why we can't use this approach
                  // config.gridData[focusedCell.dataRowIndex + j][
                  //   Object.keys(dataItem)[focusedCell.colIndex + i]
                  // ] = values[j][i];
                  // non-editable cells and cells in a calculated row can't be overridden
                  if (
                    config.columns[focusedCell.colIndex + i].editable &&
                    !config.gridData[focusedCell.dataRowIndex + j].calculated
                  ) {
                    // if some filters or sorting are active, we have to write the values in the grid differently
                    if (grid.filter?.filters || grid.sort!.length > 0) {
                      const gridData = (<GridDataResult>grid.data).data;
                      gridData[focusedCell.dataRowIndex + j][columnField] =
                        values[j][i];
                    } else
                      config.gridData[focusedCell.dataRowIndex + j][
                        columnField
                      ] = values[j][i];
                  }
                }
                // mark the cells as selected and store it's values
                config.selectedCells = [
                  ...config.selectedCells,
                  {
                    itemKey:
                      focusedCell.dataRowIndex +
                      (grid.skip ? grid.skip : 0) +
                      j,
                    columnKey: focusedCell.colIndex + i,
                  },
                ];
                // if in the pasted area there are some calculated cells, then store these values instead
                let value = '';
                if (!config.gridData[focusedCell.dataRowIndex + j].calculated) {
                  value = values[j][i];
                } else {
                  const columnField =
                    config.columns[focusedCell.colIndex + i].field;
                  value =
                    config.gridData[focusedCell.dataRowIndex + j][columnField];
                  // don't consider values from cells in case of calcualted rows, which aren't calculated fields (which are 'hidden')
                  if (
                    !config.rowCalculation.calculatedFields.includes(
                      columnField
                    ) &&
                    config.rowCalculation.titleField !== columnField
                  )
                    value = '';
                }
                config.selectedCellDatas = [
                  ...config.selectedCellDatas,
                  { value: value },
                ];
              }
            }
          }
        }
        // if we are not editing, then update the grid
        if (!grid.isEditing()) {
          methods.calculateAggregates(config);
          updateFn();
        }
        // draw the border for the selected area, but only if we are not editing
        if (!grid.isEditing()) {
          // set the first and last cell rect values
          let target = <HTMLElement>e.target;
          config.gridBody = target.parentElement?.parentElement!;
          // methods.setRectValues(config.firstSelectedCellRect, target);
          // target = gridBody!.querySelector(
          //   `[ng-reflect-data-row-index="${
          //     config.selectedCells[config.selectedCells.length - 1].itemKey
          //   }"][ng-reflect-col-index="${
          //     config.selectedCells[config.selectedCells.length - 1].columnKey
          //   }"]`
          // )!;
          // methods.setRectValues(config.lastSelectedCellRect, target);
          // draw the area
          config.firstSelectedCell = {
            itemKey: grid.activeCell.dataRowIndex + (grid.skip ? grid.skip : 0),
            columnKey: grid.activeCell.colIndex,
          };
          // we have to limit the selected area, if the pasted data area is greater than the remaining space in the grid
          config.lastSelectedCell = {
            itemKey:
              grid.activeCell.dataRowIndex +
              values.length -
              1 +
              (grid.skip ? grid.skip : 0),
            columnKey: grid.activeCell.colIndex + copiedColumnCount - 1,
          };
          // methods.resizeSelectedArea(config);
          // config.selectedArea.style.border = config.selectedAreaBorder;
          methods.drawSelectedAreaBorder(config);
          // if the grid is a calc one, then override the calc row style, if the pasted area contains some calc cells
          if (
            config.calculatedGrid &&
            config.rowCalculation.calculatedRows.length > 0
          )
            methods.overrideCalculatedCellStyle(config);
        }
      }
    });
  }
}
