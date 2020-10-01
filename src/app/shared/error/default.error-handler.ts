import {BaseErrorHandler} from './base.error-handler';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandleEnum} from '../enum/error-handler.enum';
import {environment} from '../../../environments/environment';

export class DefaultErrorHandler extends BaseErrorHandler {

  constructor() {
    super();
  }

  async handle(err: HttpErrorResponse, attempt: number): Promise<ErrorHandleEnum> {
    debugger;
    if (err.status === 502 && attempt < environment.max_resend) {
      return this.createAnswer(ErrorHandleEnum.REPEAT);
    }
    return this.createAnswer(ErrorHandleEnum.UNKNOWN);
  }

}
