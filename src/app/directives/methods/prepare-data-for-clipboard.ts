import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// prepares the copied values in a table form for the clipboard
export function prepareDataForClipboard(config: EnhancedGridConfig) {
  let firstCell = config.firstSelectedCell;
  let lastCell = config.lastSelectedCell;

  let data = '<table>';
  let columnOffset = Math.abs(lastCell.columnKey - firstCell.columnKey) + 1;
  let rowOffset = Math.abs(lastCell.itemKey - firstCell.itemKey) + 1;

  // right and down
  if (
    firstCell.itemKey <= lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      data = data.concat('<tr>');
      for (let j = 0; j <= columnOffset - 1; j++) {
        data = data.concat(
          '<td>',
          config.selectedCellDatas[i + rowOffset * j].value.toString(),
          '</td>'
        );
      }
      data = data.concat('</tr>');
    }
  }

  // right and up
  if (
    firstCell.itemKey > lastCell.itemKey &&
    firstCell.columnKey <= lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      data = data.concat('<tr>');
      for (let j = 0; j <= columnOffset - 1; j++) {
        data = data.concat(
          '<td>',
          config.selectedCellDatas[i + rowOffset * j].value.toString(),
          '</td>'
        );
      }
      data = data.concat('</tr>');
    }
  }

  //left and up
  if (
    firstCell.itemKey >= lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = rowOffset - 1; i >= 0; i--) {
      data = data.concat('<tr>');
      for (let j = columnOffset - 1; j >= 0; j--) {
        data = data.concat(
          '<td>',
          config.selectedCellDatas[i + rowOffset * j].value.toString(),
          '</td>'
        );
      }
      data = data.concat('</tr>');
    }
  }

  //left and down
  if (
    firstCell.itemKey < lastCell.itemKey &&
    firstCell.columnKey > lastCell.columnKey
  ) {
    for (let i = 0; i <= rowOffset - 1; i++) {
      data = data.concat('<tr>');
      for (let j = columnOffset - 1; j >= 0; j--) {
        data = data.concat(
          '<td>',
          config.selectedCellDatas[i + rowOffset * j].value.toString(),
          '</td>'
        );
      }
      data = data.concat('</tr>');
    }
  }

  data = data + '</table>';

  config.copiedDataToClipboard = data;
}
