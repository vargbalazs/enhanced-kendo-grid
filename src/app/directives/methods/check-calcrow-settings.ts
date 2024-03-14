import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import {
  CalculatedRow,
  SimpleRowRange,
} from '../interfaces/calculated-row.interface';

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

  // if we have calc rows inserted by pos and inserted by field, then the rows inserted by pos
  // have to be after the ones inserted by field
  if (
    config.rowCalculation.calculatedRows.findIndex((row) => row.position) >=
      0 &&
    config.rowCalculation.calculatedRows.findIndex(
      (row) => row.calculateByField
    ) >= 0
  ) {
    const lastIndexCalcByField = config.rowCalculation.calculatedRows.reduce(
      (prev, curr, index) => (curr.calculateByField ? index : prev),
      -1
    );
    const firstIndexByPos = config.rowCalculation.calculatedRows.findIndex(
      (row) => row.position
    );
    if (firstIndexByPos < lastIndexCalcByField) {
      console.error(
        'If you have rows calculated by a field and rows inserted at a specific position, then you have to declare first the rows calculated by a field.'
      );
      config.wrongCalcRowSettings = true;
    }
  }

  // if we have any calc rows inserted by pos and calculated by rows, where the from value is greater than the to value
  wrongConfig = config.rowCalculation.calculatedRows.find(
    (row) =>
      row.position &&
      (<SimpleRowRange>row.calculateByRows)?.from >
        (<SimpleRowRange>row.calculateByRows)?.to
  );
  if (wrongConfig) {
    console.error(
      `For the calculated row ${wrongConfig.name} the from value is greater than the to value.`
    );
    config.wrongCalcRowSettings = true;
  }
}
