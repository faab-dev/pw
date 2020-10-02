import {SeparatedBaseComponent} from '../../shared/component/separated-base/sepatated-base.component';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {AuthStatusEnum} from '../../shared/enum/auth-status.enum';
import {Router} from '@angular/router';
import {HttpService} from '../../shared/service/http.service';
import {StorageService} from '../../shared/service/storage.service';
import {FormGroupInterface} from '../../shared/interface/form-group.interface';
import {FormValidationErrors} from '../../shared/interface/form-validation-errors';
import {AuthError} from '../../shared/enum/auth-error.enum';
import {AuthToken} from '../../shared/interface/auth-token.interface';
import {TitleService} from '../../shared/service/title.service';
import {AppPathEnum} from '../../shared/enum/app-path.enum';

export class AuthBaseComponent extends SeparatedBaseComponent {
  public formModel: FormGroup;
  public authStatus: AuthStatusEnum = AuthStatusEnum.INITIALIZED;
  protected title = '';

  private flagFormError: any;

  constructor(
    public model: FormGroupInterface,
    protected titleService: TitleService,
    protected storage: StorageService,
    protected router: Router,
    protected http: HttpService
  ) {
    super();
  }

  onInit(): void {
    super.onInit();
    this.formModel = this.model.getFormGroup();
    this.titleService.setT(this.title);
  }

  get f(): {[key: string]: AbstractControl} {
    return this.formModel.controls;
  }

  isDisabled(): boolean {
    return (this.formModel.status !== 'VALID' ||
      [
        AuthStatusEnum.HTTP_PROCESSING,
      ].indexOf(this.authStatus) >= 0);
  }



  getFormValidationErrors(field: string | null): FormValidationErrors {
    const formValidationErrors: FormValidationErrors = {validation_errors: null, show: false};

    // form error
    if (field === null) {
      if (
        this.flagFormError
        && this.flagFormError.validation_errors
        && this.flagFormError.show
      ) {
        return this.flagFormError;
      }
      formValidationErrors.validation_errors = this.formModel.errors;
      formValidationErrors.show = this.formModel.errors !== null;
      const self = this;
      this.flagFormError = formValidationErrors;
      if (formValidationErrors.show && formValidationErrors.validation_errors) {
        setTimeout(() => {
          self.flagFormError = null;
          return;
        }, 6000);
      }
      return formValidationErrors;
    }

    // form control error
    if (!field /*|| !this.f[field]*/) {
      // throw new Error('Wrong argument: incorrect field setted.');
      return formValidationErrors;
    }

    const formControl: AbstractControl | null = this.formModel.get(field);

    if (formControl === null) {
      return formValidationErrors;
    }
    formValidationErrors.validation_errors = this.f[field].errors;
    const show = this.f[field].errors !== null && (this.f[field].dirty || this.f[field].touched);
/*    console.log('show: ', show);
    console.log('this.f[field].dirty: ' , formControl.dirty);
    console.log('this.f[field].touched: ' , formControl.touched);
    console.log('this.f[field].pristine: ' , formControl.pristine);
    console.log('f[field].errors: ', this.f[field].errors)*/
    formValidationErrors.show = this.f[field].errors !== null && (this.f[field].dirty || this.f[field].touched);
    return formValidationErrors;
  }

  getError(field: string): string {
    const errors: FormValidationErrors = this.getFormValidationErrors(field);
    if (!errors || !errors.validation_errors) {
      console.log('no errors');
      return '';
    }
    const errorMessageValue: {[key: string]: any} = {
      required: 'This field is required. '
    };
    let message = '';
    for (const [key, value] of Object.entries(errors.validation_errors)) {
      if (
        !value
        || !key
        || !errorMessageValue
        || !errorMessageValue[key]
        || typeof errorMessageValue[key] !== 'string'
      )  {
        continue;
      }
      message += errorMessageValue[key];
    }
    return message;
  }

  showError(field: string): boolean {
    const errors: FormValidationErrors = this.getFormValidationErrors(field);
    return (errors && errors.show);
  }


  protected setFormErrors(validationErrorsKey: AuthError | AuthError[]): void {
    if (!validationErrorsKey) {
      return;
    }
    const formValidationErrors: FormValidationErrors = {
      validation_errors: {},
      show: false
    };
    if (typeof validationErrorsKey !== 'string') {
      if (!Array.isArray(validationErrorsKey)) {
        return;
      }

      const length = validationErrorsKey.length;
      for (let i = 0; i < length; i++) {
        if (formValidationErrors.validation_errors == null) {
          formValidationErrors.validation_errors = {};
        }
        formValidationErrors.validation_errors[validationErrorsKey[i]] = true;
      }
    } else {
      if (formValidationErrors.validation_errors == null) {
        formValidationErrors.validation_errors = {};
      }
      formValidationErrors.validation_errors[validationErrorsKey] = true;
    }
    this.formModel.setErrors(formValidationErrors);
    this.authStatus = AuthStatusEnum.INITIALIZED;

  }

  protected checkAuthUserRoles(authToken: AuthToken): void {
    if (!authToken || !authToken.id_token) {
      this.setFormErrors(AuthError.INVALIDE_TOKEN);
      return;
    }

    this.storage.setAuthKey(authToken.id_token);
    this.router.navigate(['/', AppPathEnum.protected]);
  }

  getTitle(): string {
    return this.title;
  }
}
