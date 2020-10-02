import {FormGroupInterface} from '../interface/form-group.interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export class Login implements FormGroupInterface {

  public email: string;
  public password: string;

  constructor(email: string = '', password: string = '') {
    this.email = email;
    this.password = password;
  }

  getFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});
  }

}
