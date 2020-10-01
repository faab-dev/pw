import {HttpErrorResponse} from '@angular/common/http';

export interface ResponseInterfaces<T> {
  success(obj: T, response): void;
  failed?(err: HttpErrorResponse): void;
}
