import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// checks some settings, if the grid is grouped
export function checkGroupedGridSettings(config: EnhancedGridConfig): boolean {
  // there should be at least one group column
  if (!config.columns.some((col) => col.field.startsWith('grouplevel'))) {
    console.error(
      `If grouping is allowed, there should be at least one column with a field name 'grouplevelx', where x is the level index.`
    );
    return false;
  }
  // the group columns should be always the first ones
  // get the group column indexes
  const groupColIndexes: number[] = [];
  config.columns
    .filter((col) => col.field.startsWith('grouplevel'))
    .forEach((col) => {
      groupColIndexes.push(
        config.columns.findIndex((col2) => col2.field === col.field)
      );
    });
  // get the first index of a non-group column
  const firstIndex = config.columns.findIndex(
    (col) => !col.field.startsWith('grouplevel')
  );
  if (groupColIndexes.some((colIndex) => colIndex > firstIndex)) {
    console.error(
      'The group columns should be always the first ones in the grid.'
    );
    return false;
  }
  // there sould be max 3 group columns (levels)
  if (groupColIndexes.length > 3) {
    console.error('The maximum number of group columns (levels) is 3.');
    return false;
  }
  // the levels should be 1, 2, 3
  const levels: string[] = [];
  let levelsMessage = '';
  config.columns.forEach((col) => {
    if (col.field.startsWith('grouplevel'))
      levels.push(col.field.replace('grouplevel', ''));
  });
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (!Number.isFinite(+level)) {
      levelsMessage = 'Valid group levels are: 1, 2, 3.';
      break;
    }
    if (+level !== i + 1) {
      levelsMessage = 'Group level should follow each other (1, 2, 3).';
      break;
    }
  }
  if (levelsMessage.length > 0) {
    console.error(levelsMessage);
    return false;
  }
  return true;
}
