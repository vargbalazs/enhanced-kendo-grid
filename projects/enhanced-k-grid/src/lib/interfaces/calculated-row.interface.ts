export interface CalculatedRow {
  name: string;
  position?: number;
  align?: 'top' | 'bottom';
  title: string;
  calculateByField?: { fieldName: string; fieldValue: string };
  calculateByRows?: string[] | SimpleRowRange | ConditionalRowRange;
  calculateFunction?: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  customFunction?: (values: any[]) => any;
  cssClass?: string;
  state?: 'expanded' | 'collapsed';
  rowIndexes?: number[];
  groupLevel?: number;
  parentRowName?: string;
  empty?: boolean;
}

export interface SimpleRowRange {
  from: number;
  to: number;
}

export interface ConditionalRowRange {
  from: { field: string; value: string | number };
  to: { field: string; value: string | number };
}
