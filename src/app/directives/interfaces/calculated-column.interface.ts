export interface CalculatedColumn {
  name: string;
  field: string;
  calculateByColumns: string[];
  calculateFunction: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
}
