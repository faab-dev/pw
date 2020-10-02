import {SeparatedBaseComponent} from '../separated-base/sepatated-base.component';
import {Component, forwardRef, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AbstractControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TransferData} from '../../model/transfer-data';
import {Observable, Observer} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FilteredUsernameInterface} from '../../interface/filtered-username.interface';
import {HttpService} from '../../service/http.service';
import {ResponseInterfaces} from '../../interface/response.interface';
import {TransTokenNewInterface} from '../../interface/trans-token-new.interface';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-transfer-create-dialog',
  templateUrl: 'transfer-create-dialog.component.html',
})
export class TransferCreateDialogComponent extends SeparatedBaseComponent {

  formModel: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<Observable<string[]>>;

  constructor(
    public dialogRef: MatDialogRef<TransferCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransferData,
    private http: HttpService,
    private userService: UserService
  ) {
    super();
    const transferData = new TransferData(this.data.name,  parseFloat(Math.abs(this.data.amount).toFixed(2)), userService);
    this.formModel = transferData.getFormGroup();
  }

  onInit(): void {
    super.onInit();

    const fControlName: AbstractControl | null = this.formModel.get('name');
    const fControlAmount: AbstractControl | null = this.formModel.get('amount');
    if (fControlAmount) {
      fControlAmount.setValue(Math.abs(this.data.amount));
    }
    if (fControlName) {
      fControlName.setValue(this.data.name);

      this.filteredOptions = fControlName.valueChanges.pipe(
        startWith(''),
        map(
          (nameFilterValue) => {
            console.log('before new observable nameFilterValue: ' + nameFilterValue);
            return new Observable(
              (observer: Observer<string[]>) => {
                this.http
                  .post<FilteredUsernameInterface[]>(
                    '/api/protected/users/list',
                    {filter: nameFilterValue},
                    {
                      success(objs: FilteredUsernameInterface[]): void {
                        console.log('http success objs: ' + objs);
                        if (!objs || !Array.isArray(objs)) {
                          return;
                        }
                        console.log('objs: ');
                        console.log(objs);
                        observer.next(objs.map(
                          (value: FilteredUsernameInterface) => {
                            return value.name;
                          }
                        ));
                      }
                    } as ResponseInterfaces<FilteredUsernameInterface[]>
                  );
              }
            );
          }
        )
      );
    }


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const self = this;
    const fControlName: AbstractControl | null = this.formModel.get('name');
    const fControlAmount: AbstractControl | null = this.formModel.get('amount');
    if (
      !fControlName
      || !fControlAmount
    ) {
      return;
    }
    if (!fControlName.value) {
      fControlName.setErrors(
        {
          required: true
        }, {emitEvent: true}
      );
      return;
    }
    if (!fControlAmount.value || isNaN(fControlAmount.value)) {
      fControlAmount.setErrors(
        {
          required: true
        }, {emitEvent: true}
      );
      return;
    }
    this.http
      .post<TransTokenNewInterface>(
        '/api/protected/transactions',
        {name: fControlName.value,
          amount: parseFloat(fControlAmount.value).toFixed(2)
        },
        {
          success(obj: TransTokenNewInterface): void {
            self.dialogRef.close();
          }
        } as ResponseInterfaces<TransTokenNewInterface>
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
