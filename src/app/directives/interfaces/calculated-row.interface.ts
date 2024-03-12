export interface CalculatedRow {
  name: string;
  position?: number;
  title: string;
  calculateByField?: { fieldName: string; fieldValue: string };
  calculateByRows?: string[] | { from: number; to: number };
  calculateFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  customFunction?: string;
  cssClass?: string;
}
