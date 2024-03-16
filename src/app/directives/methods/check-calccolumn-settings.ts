import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';

// checks the calc column settings
export function checkCalcColSettings(config: EnhancedGridConfig) {
  config.colCalculation.calculatedColumns.forEach((calcCol) => {
    // the calc col field should be present in the columns array
    if (!config.columns.find((col) => col.field === calcCol.field)) {
      console.error(
        `For the calculated column '${calcCol.name}' there is no column '${calcCol.field}' defined.`
      );
      config.wrongCalcColSettings = true;
    }
    // the columns involved in the calculation should be also present in the columns array
    calcCol.calculateByColumns.forEach((involvCol) => {
      if (!config.columns.find((col) => col.field === involvCol)) {
        console.error(
          `For the calculated column '${calcCol.name}' there is no column '${involvCol}' defined.`
        );
        config.wrongCalcColSettings = true;
      }
    });
  });
}
