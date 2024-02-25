export interface CalculatedRow {
  name: string;
  position?: number;
  title: string;
  calculateByField?: { fieldName: string; fieldValue: string };
  calculateByRows?: number[];
  calculateFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  customFunction?: string;
  cssClass?: string;
}
