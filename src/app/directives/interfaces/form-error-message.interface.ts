import { ValidationErrors } from '@angular/forms';

export interface FormErrorMessage {
  error: ValidationErrors;
  message: string;
}
