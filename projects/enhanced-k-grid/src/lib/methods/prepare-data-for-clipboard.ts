import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// prepares the copied values in a table form for the clipboard
export function prepareDataForClipboard(config: EnhancedGridConfig) {
  let firstCell = config.firstSelectedCell;
  let lastCell = config.lastSelectedCell;

  let data = ''; //'<table>';
  let columnOffset = Math.abs(lastCell.columnKey - firstCell.columnKey) + 1;
  let rowOffset = Math.abs(lastCell.itemKey - firstCell.itemKey) + 1;

  // right and down
  if (
    firstCell.itemKey <= lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      for (let j = 0; j <= columnOffset - 1; j++) {
        if (j < columnOffset - 1) {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString(),
            '\t'
          );
        } else {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString()
          );
        }
      }
      data = data.concat('\r\n');
    }
  }

  // right and up
  if (
    firstCell.itemKey > lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      for (let j = 0; j <= columnOffset - 1; j++) {
        if (j < columnOffset - 1) {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString(),
            '\t'
          );
        } else {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString()
          );
        }
      }
      data = data.concat('\r\n');
    }
  }

  //left and up
  if (
    firstCell.itemKey >= lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      for (let j = columnOffset - 1; j >= 0; j--) {
        if (j > 0) {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString(),
            '\t'
          );
        } else {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString()
          );
        }
      }
      data = data.concat('\r\n');
    }
  }

  //left and down
  if (
    firstCell.itemKey < lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      for (let j = columnOffset - 1; j >= 0; j--) {
        if (j > 0) {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString(),
            '\t'
          );
        } else {
          data = data.concat(
            config.selectedCellDatas[i + rowOffset * j].value.toString()
          );
        }
      }
      data = data.concat('\r\n');
    }
  }

  config.copiedDataToClipboard = data;
}
