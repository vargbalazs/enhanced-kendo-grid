import { ColumnComponent } from '@progress/kendo-angular-grid';

// checks whether a column is editable or not
export function isColumnNotEditable(
  columns: ColumnComponent[],
  fieldName: string
) {
  const nonEditableColumns = columns.filter((c) => !c.editable);
  return nonEditableColumns.some((c) => c.field === fieldName);
}
