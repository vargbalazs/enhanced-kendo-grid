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
  // all calculated rows should have a grouplevel property with a valid value
  if (
    !config.rowCalculation.calculatedRows.every((calcRow) => calcRow.groupLevel)
  ) {
    console.error(
      `In a grouped grid all calculated rows should have a 'groupLevel' property.`
    );
    return false;
  }
  // the groupLevel value should be between 1 and 3
  levelsMessage = '';
  for (let i = 0; i <= config.rowCalculation.calculatedRows.length - 1; i++) {
    const row = config.rowCalculation.calculatedRows[i];
    if (row.groupLevel! < 1 || row.groupLevel! > 3) {
      levelsMessage = `The 'groupLevel' poperty should be between 1 and 3 for each calculated row.`;
      break;
    }
  }
  if (levelsMessage.length > 0) {
    console.error(levelsMessage);
    return false;
  }
  // we should define as many group columns as many levels we have in the calc row config
  const calcRowLevels: Set<string> = new Set();
  config.rowCalculation.calculatedRows.forEach((calcRow) => {
    if (!calcRowLevels.has(calcRow.groupLevel!.toString()))
      calcRowLevels.add(calcRow.groupLevel!.toString());
  });
  if (levels.length != calcRowLevels.size) {
    console.error(
      'The number of the group columns in the template should be the same as many different group levels were definded in the row calculation config.'
    );
    return false;
  }
  // the group level numbers in the template should match to the unique group level numbers in the calc row config
  // f. e. in the template we have lvl 1 and 2 and in the config lvl 2 and 3
  const configLvls = [...calcRowLevels].sort();
  for (let i = 0; i <= levels.length - 1; i++) {
    if (+levels[i] - +configLvls[i] != 0) {
      console.error(
        'The group level numbers in the template should match to the unique group level numbers in the calc row config.'
      );
      return false;
    }
  }
  return true;
}
