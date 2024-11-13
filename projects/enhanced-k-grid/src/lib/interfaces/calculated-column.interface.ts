import { FormGroup } from '@angular/forms';

export interface CalculatedColumn {
  name: string;
  field: string;
  calculateByColumns: string[];
  calculateFunction: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom';
  composed?: boolean;
  customFunction?: (formGroup: FormGroup) => any;
}
