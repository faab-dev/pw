import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export interface ResponseInterfaces<T> {
  success(obj: T, response: HttpResponse<any> | null): void;
  failed?(err: HttpErrorResponse): void;
}
