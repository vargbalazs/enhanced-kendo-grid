import { KeyAndField } from '../interfaces/key-and-field.interface';

// extracts the key and field name from a field, if we reference to the field name using dot
export function extractKeyAndField(field: string): KeyAndField {
  if (field.includes('.'))
    return {
      key: field.substring(0, field.indexOf('.')),
      fieldName: field.substring(field.indexOf('.') + 1),
    };
  return { key: field };
}
