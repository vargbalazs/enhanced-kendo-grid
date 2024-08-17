import { EnhancedGridConfig } from '../classes/enhanced-grid-config.class';
import { CalcRowWithState } from '../interfaces/calculated-row-with-state';

// get the state for a calculated row
export function getStateForCalcRow(
  config: EnhancedGridConfig,
  calcRowIndex: number
): CalcRowWithState {
  const calcRowWithState: CalcRowWithState = {
    calcRowName: '',
    state: 'expanded',
  };
  const calcRowName = config.gridData[calcRowIndex].calcRowName;
  const calcRowState = config.rowCalculation.calculatedRows.find(
    (calcRow) => calcRow.name === calcRowName
  )?.state!;
  calcRowWithState.calcRowName = calcRowName;
  calcRowWithState.state = calcRowState;
  return calcRowWithState;
}
