import { CalculatedRow } from './calculated-row.interface';

export interface RowCalculation {
  titleField: string;
  calculatedFields: string[];
  calculatedRows: CalculatedRow[];
}
