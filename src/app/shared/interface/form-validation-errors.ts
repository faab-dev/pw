import {ValidationErrors} from '@angular/forms';

export interface FormValidationErrors {
  validation_errors: ValidationErrors | null;
  show: boolean;
}
