import { FormGroup } from '@angular/forms';
import { NavigationCell } from '@progress/kendo-angular-grid';
import { KeyAndField } from './key-and-field.interface';

export interface CellValueChangedEvent {
  cellEditingFormGroup: FormGroup<any>;
  activeCell: NavigationCell;
  keyAndField: KeyAndField;
  oldValue: any;
  newValue: any;
}
