import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import * as methods from './index';

// marks the cells as selected in every direction
export function markCellsAsSelected(config: EnhancedGridConfig) {
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
  // if the next cell isn't selected, then add it to the selecte cells and it's value to the selected cell datas
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
            config.gridData[firstCell.itemKey + j * verticalDirection][
              objectKey
            ][propertyKey];
        } else {
          value =
            config.gridData[firstCell.itemKey + j * verticalDirection][
              fieldname
            ];
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
