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
    // a calc column, which references an other column should be composed
    calcCol.calculateByColumns.forEach((calcByCol) => {
      if (
        config.colCalculation.calculatedColumns.find(
          (col) => col.field === calcByCol && !calcCol.composed
        )
      ) {
        console.error(`The column '${calcCol.name}' should be composed.`);
        config.wrongCalcColSettings = true;
      }
    });
    // in case of composed calc columns all calculateByColumns should be defined before the composed column
    // otherwise we get no calc values for this column
    if (calcCol.composed) {
      const calcColIndex = config.colCalculation.calculatedColumns.findIndex(
        (col) => col.name === calcCol.name
      );
      calcCol.calculateByColumns.forEach((calcByCol) => {
        const calcByColIndex =
          config.colCalculation.calculatedColumns.findIndex(
            (col) => col.field === calcByCol
          );
        if (calcColIndex < calcByColIndex) {
          console.error(
            `The composed column '${calcCol.name}' should follow all it's referenced columns.`
          );
          config.wrongCalcColSettings = true;
        }
      });
    }
  });
}
