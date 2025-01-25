import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CellData } from '../interfaces/celldata.interface';

// prepares the copied values in a table form for the clipboard
export function prepareDataForClipboard(config: EnhancedGridConfig) {
  let firstCell = config.firstSelectedCell;
  let lastCell = config.lastSelectedCell;

  let data = ''; //'<table>';
  let columnOffset = Math.abs(lastCell.columnKey - firstCell.columnKey) + 1;
  let rowOffset = Math.abs(lastCell.itemKey - firstCell.itemKey) + 1;

  // copy hidden values or not
  let cellDatas: CellData[] = [];
  if (config.copyCollapsedRows) {
    cellDatas = config.selectedCellDatas;
  } else {
    cellDatas = config.selectedCellDatas.filter((cellData) => !cellData.hidden);
  }

  // right and down
  if (
    firstCell.itemKey <= lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      let hidden = false;
      for (let j = 0; j <= columnOffset - 1; j++) {
        let cellData = config.selectedCellDatas[i + rowOffset * j];
        let value = cellData.value;
        // if the value is in a hidden row
        hidden = cellData.hidden! && !config.copyCollapsedRows;
        value = hidden ? '' : value;
        value = parseValue(value);
        if (j < columnOffset - 1) {
          if (!hidden) data = data.concat(value, '\t');
        } else {
          data = data.concat(value);
        }
      }
      if (!hidden) data = data.concat('\r\n');
    }
  }

  // right and up
  if (
    firstCell.itemKey > lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      let hidden = false;
      for (let j = 0; j <= columnOffset - 1; j++) {
        let cellData = config.selectedCellDatas[i + rowOffset * j];
        let value = cellData.value;
        hidden = cellData.hidden! && !config.copyCollapsedRows;
        value = hidden ? '' : value;
        value = parseValue(value);
        if (j < columnOffset - 1) {
          if (!hidden) data = data.concat(value, '\t');
        } else {
          data = data.concat(value);
        }
      }
      if (!hidden) data = data.concat('\r\n');
    }
  }

  //left and up
  if (
    firstCell.itemKey >= lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      let hidden = false;
      for (let j = columnOffset - 1; j >= 0; j--) {
        let cellData = config.selectedCellDatas[i + rowOffset * j];
        let value = cellData.value;
        hidden = cellData.hidden! && !config.copyCollapsedRows;
        value = hidden ? '' : value;
        value = parseValue(value);
        if (j > 0) {
          if (!hidden) data = data.concat(value, '\t');
        } else {
          data = data.concat(value);
        }
      }
      if (!hidden) data = data.concat('\r\n');
    }
  }

  //left and down
  if (
    firstCell.itemKey < lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      let hidden = false;
      for (let j = columnOffset - 1; j >= 0; j--) {
        let cellData = config.selectedCellDatas[i + rowOffset * j];
        let value = cellData.value;
        hidden = cellData.hidden! && !config.copyCollapsedRows;
        value = hidden ? '' : value;
        value = parseValue(value);
        if (j > 0) {
          if (!hidden) data = data.concat(value, '\t');
        } else {
          data = data.concat(value);
        }
      }
      if (!hidden) data = data.concat('\r\n');
    }
  }

  config.copiedDataToClipboard = data;
}

function parseValue(value: any): string {
  if (value instanceof Date)
    return new Date(value).toLocaleDateString(window.navigator.language);
  return value.toString();
}
