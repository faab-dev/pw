import {FormGroupInterface} from '../interface/form-group.interface';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';

export class SignIn implements FormGroupInterface {

  public username: string;
  public password: string;
  public passwordConfirm: string;
  public email: string;

  constructor(usermane: string = '', email: string = '', password: string = '', passwordConfirm: string = '') {
    this.username = usermane;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.email = email;
  }

  public static matchValues(
    matchTo: string // name of the control to match to
  ): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        !!control.parent
        && !!control.parent.value
        && control.parent.controls
      ) {
        const controls: {[key: string]: AbstractControl} | AbstractControl[] = control.parent.controls;
        if (!Array.isArray(controls)) {
          return (control.value === controls[matchTo].value) ? null : { isMatching: false };
        }
      }
      return null;
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

    const passwordControl: AbstractControl | null = group.get('password');
    const passwordConfirmControl: AbstractControl | null = group.get('password');
    const pass = (passwordControl === null) ? '' : passwordControl.value;
    const confirmPass = (passwordConfirmControl === null) ? '' : passwordConfirmControl.value;

    return pass === confirmPass ? null : { notSame: true };
  }



}
