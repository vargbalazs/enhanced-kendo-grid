import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalculatedRow } from '../interfaces/calculated-row.interface';

// checks the setup of the calcrow settings
export function checkCalcRowSettings(config: EnhancedGridConfig) {
  // we can insert calculated rows by providing either
  // - its's row position (index)
  // - a field name and it's value (similar to grouping) - in this case the index at which we insert the row is calculated automatically
  // generate error and return, if row positon and also fields are provided
  let wrongConfig: CalculatedRow | undefined;
  wrongConfig = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.position && calcRow.calculateByField
  );
  if (wrongConfig) {
    console.error(
      `For the calculated row ${wrongConfig.name} it was provided a row position and also a grouping field. You can only set only one of them.`
    );
    config.wrongCalcRowSettings = true;
  }

  // we can calculate by fields or by other rows, but not by fields and by rows
  wrongConfig = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.calculateByField && calcRow.calculateByRows
  );
  if (wrongConfig) {
    console.error(
      `For the calculated row ${wrongConfig.name} it was provided a grouping field and also other referenced rows. You can only set only one of them.`
    );
    config.wrongCalcRowSettings = true;
  }
}
