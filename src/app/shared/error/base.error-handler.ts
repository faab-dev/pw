import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandleEnum} from '../enum/error-handler.enum';

export class BaseErrorHandler {

  handle(err: HttpErrorResponse, attempt: number): Promise<ErrorHandleEnum> {
    return new Promise<ErrorHandleEnum>(resolve => {
      return ErrorHandleEnum.UNKNOWN;
    });
  }

  createAnswer(error: ErrorHandleEnum): Promise<ErrorHandleEnum> {

    return new Promise<ErrorHandleEnum>(resolve => {
      debugger;
      return error;
    });
  }


}
