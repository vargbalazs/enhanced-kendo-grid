export interface CalculatedRow {
  name: string;
  position?: number;
  title: string;
  calculateByField?: { fieldName: string; fieldValue: string };
  calculateByRows?: string[] | SimpleRowRange | ConditionalRowRange;
  calculateFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  customFunction?: string;
  cssClass?: string;
}

export interface SimpleRowRange {
  from: number;
  to: number;
}

export interface ConditionalRowRange {
  from: { field: string; value: string | number };
  to: { field: string; value: string | number };
}
