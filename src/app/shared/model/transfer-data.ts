import {FormGroupInterface} from '../interface/form-group.interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from "../service/user.service";

export class TransferData implements FormGroupInterface {

  public name: string;
  public amount: number;

  constructor(
    name: string,
    amount: number,
    public userService: UserService
  ) {
    this.name = name;
    this.amount = amount;
  }

  getFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(0.02), Validators.max(this.userService.getBalance())])
    }, {updateOn: 'change'});
  }

}
