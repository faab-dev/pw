import {Component} from '@angular/core';
import {SeparatedBaseComponent} from '../../shared/component/separated-base/sepatated-base.component';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AppPathEnum} from "../../shared/enum/app-path.enum";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['error.component.scss']
})
export class ErrorComponent extends SeparatedBaseComponent {
  private activatedRouteSubscription;
  errorCode = 501;
  constructor(
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }
  onInit(): void {
    super.onInit();
    this.activatedRouteSubscription = this.activatedRoute.paramMap.subscribe(
      (param: any) => {
        if (!param.params) {
          return;
        }
        if (param.params[AppPathEnum.error_code]) {
          this.errorCode = parseInt(param.params[AppPathEnum.error_code], 10);
        }
      }
    );
  }
  onDestroy(): void {
    super.onDestroy();
    this.checkSubscription(this.activatedRouteSubscription);
  }
  getReason(): string {
    switch (this.errorCode) {
      case 401:
        return 'Your session has probably expired.';
      case 500:
        return 'Service is unavailable.';
      default:
        return 'Error undefined';
    }
  }
}
