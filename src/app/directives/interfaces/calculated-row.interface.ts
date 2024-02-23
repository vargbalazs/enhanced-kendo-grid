export interface CalculatedRow {
  name: string;
  position?: number;
  title: { writeToField: string; value: string };
  calculateByField?: { fieldName: string; fieldValue: string };
  calculatedFields: string[];
  calculateByRows?: number[];
  calculateFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  customFunction?: string;
  cssClass?: string | string[];
}
