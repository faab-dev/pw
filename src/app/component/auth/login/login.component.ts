import {Component} from '@angular/core';
import {HttpService} from '../../../shared/service/http.service';
import {AuthBaseComponent} from '../auth-base.component';
import {Router} from '@angular/router';
import {StorageService} from '../../../shared/service/storage.service';
import {AuthStatusEnum} from '../../../shared/enum/auth-status.enum';
import {SignIn} from '../../../shared/model/sign-in';
import {AuthToken} from '../../../shared/interface/auth-token.interface';
import {ResponseInterfaces} from '../../../shared/interface/response.interface';
import {AuthError} from '../../../shared/enum/auth-error.enum';
import {TitleService} from '../../../shared/service/title.service';
import {Login} from '../../../shared/model/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent extends AuthBaseComponent {
  protected title = 'Login';

  constructor(
    protected titleService: TitleService,
    protected http: HttpService,
    protected router: Router,
    protected storage: StorageService,
  ) {
    super(new Login(), titleService, storage, router, http);
  }

  onInit(): void {
    super.onInit();
    this.authStatus = AuthStatusEnum.INITIALIZED;
  }

  onSubmit(): void {
    if (this.isDisabled()) {
      return;
    }
    this.authStatus = AuthStatusEnum.HTTP_PROCESSING;
    this.actionSignIn();
  }

  private actionSignIn(): void {
    this.formModel.setErrors(null);
    const self = this;
    this.http
      .post<AuthToken>('/sessions/create', new Login(this.f.email.value, this.f.password.value), {
        success(obj: AuthToken): void {
          self.checkAuthUserRoles(obj);
        },
        failed(error): void {
          switch (error.status) {
            case 404:
              self.setFormErrors(AuthError.USER_NOT_FOUND);
              return;
            default:
              self.authStatus = AuthStatusEnum.INITIALIZED;
          }
        }
      } as ResponseInterfaces<AuthToken>);
  }
/*
  isDisabled(): boolean {
    return super.isDisabled() && (!this.formModel.dirty || !this.formModel.touched);
  }*/
}
