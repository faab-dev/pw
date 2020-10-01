import {FormGroupInterface} from '../interface/form-group.interface';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

export class SignIn implements FormGroupInterface {

  public username: string;
  public password: string;
  public passwordConfirm: string;
  public email: string;

  constructor(usermane?: string, email?: string, password?: string, passwordConfirm?: string) {
    this.username = usermane;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.email = email;
  }

  public static matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  getFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required, SignIn.matchValues('password')]),
      email: new FormControl('', [Validators.required])
    }, {updateOn: 'change'/*, validator: this.checkPasswords*/}, );
  }

  checkPasswords(group: FormGroup): {notSame: true} | null { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPass').value;

    return pass === confirmPass ? null : { notSame: true };
  }



}
