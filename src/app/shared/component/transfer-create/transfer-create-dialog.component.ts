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
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandleEnum} from '../../enum/error-handler.enum';
import {ErrorStatus} from '../../enum/error-status.enum';

@Component({
  selector: 'app-transfer-create-dialog',
  templateUrl: 'transfer-create-dialog.component.html',
})
export class TransferCreateDialogComponent extends SeparatedBaseComponent {

  formModel: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<Observable<string[]>>;
  httpError = '';
  private errorTimer: any;
  private readonly errorTimerValue = 3000;
  private typeTimer: any;
  private readonly typeTimerValue = 600;



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
      const self = this;

      this.filteredOptions = fControlName.valueChanges.pipe(
        startWith(''),
        map(
          (nameFilterValue) => {
            return new Observable(
              (observer: Observer<string[]>) => {
                clearTimeout(self.typeTimer);
                const value = nameFilterValue.trim().toLocaleLowerCase();
                if (!value) {
                  return;
                }
                self.typeTimer = setTimeout(
                  () => {
                    this.http
                      .post<FilteredUsernameInterface[]>(
                        '/api/protected/users/list',
                        {filter: value},
                        {
                          success(objs: FilteredUsernameInterface[]): void {
                            if (!objs || !Array.isArray(objs)) {
                              return;
                            }
                            observer.next(objs.map(
                              (userValue: FilteredUsernameInterface) => {
                                return userValue.name;
                              }
                            ));
                          },
                          failed(err: HttpErrorResponse): void {
                            if (err.status === ErrorStatus.UNAUTHORIZED) {
                              self.userService.logout(ErrorStatus.UNAUTHORIZED);
                            }
                          }
                        } as ResponseInterfaces<FilteredUsernameInterface[]>
                      );
                  }, self.typeTimerValue
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
          },
          failed(err: HttpErrorResponse): void {
            if (err.status === ErrorStatus.UNAUTHORIZED) {
              self.userService.logout(ErrorStatus.UNAUTHORIZED);
            }
            self.setError(err.error);
          }
        } as ResponseInterfaces<TransTokenNewInterface>
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  setError(message: string): void {
    clearTimeout(this.errorTimer);
    this.httpError = message;
    this.errorTimer = setTimeout(
      () => {
        this.httpError = '';
      }, this.errorTimerValue
    );
  }

}
