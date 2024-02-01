import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// add the appr. styling to the frozen columns
export function handleFrozenColumns(config: EnhancedGridConfig) {
  // get the sorted indexes of the frozen columns
  let colIndexes = [];
  for (let i = 0; i <= config.frozenColumns.length - 1; i++) {
    if (
      config.columns.findIndex(
        (column) => column.field === config.frozenColumns[i]
      ) != -1
    )
      colIndexes.push(
        config.columns.findIndex(
          (column) => column.field === config.frozenColumns[i]
        )
      );
  }
  colIndexes.sort();
  // if the first element isn't 0, then error
  if (colIndexes[0] !== 0) {
    console.error('Frozen columns should start from the first column!');
    return;
  }
  // there should be no gap between the elements (if we have at least 2)
  let noGap = true;
  if (colIndexes.length > 1) {
    for (let i = 1; i <= colIndexes.length - 1; i++) {
      if (colIndexes[i] - colIndexes[i - 1] > 1) {
        noGap = false;
        break;
      }
    }
  }
  if (!noGap) {
    console.error('The frozen columns should follow each other with no gaps!');
    return;
  }
}