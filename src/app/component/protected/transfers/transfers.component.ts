import {SeparatedBaseComponent} from '../../../shared/component/separated-base/sepatated-base.component';
import {Component} from '@angular/core';
import {UserInfo} from '../../../shared/interface/user-info.interface';
import {HttpService} from '../../../shared/service/http.service';
import {TransferInterface} from '../../../shared/interface/transfer.interface';
import {TransTokenInterface} from '../../../shared/interface/trans-token.interface';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TransferCreateDialogComponent} from '../../../shared/component/transfer-create/transfer-create-dialog.component';
import {MenuService} from '../../../shared/service/menu.service';
import {Subscription} from 'rxjs';
import {ErrorStatus} from '../../../shared/enum/error-status.enum';
import {UserService} from '../../../shared/service/user.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['transfers.component.scss']
})
export class TransfersComponent extends SeparatedBaseComponent {

  displayedColumns: string[] = ['date', 'username', 'amount', 'balance', 'button'];
  dataSource: TransferInterface[] = [];

  private emitCreateTransferSubscription: Subscription;

  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private menu: MenuService,
    private userService: UserService
  ) {
    super();
  }
  getTitle(): string {
    return 'Your transfers';
  }

  onInit(): void {
    super.onInit();

    this.emitCreateTransferSubscription = this.menu.emitTransferCreate.subscribe(
      () => {
        this.openDialog();
      }
    );
    this.updateSource();
  }

  onDestroy(): void {
    super.onDestroy();
    this.checkSubscription(this.emitCreateTransferSubscription);
  }

  onClickTableItem(transfer: TransferInterface): void {
    this.openDialog(transfer);
  }

  private updateSource(): void {
    const self = this;
    self.http
      .get<TransTokenInterface>('/api/protected/transactions',  {
        success(obj: TransTokenInterface): void {
          if (!obj || !obj.trans_token) {
            return;
          }
          self.dataSource = obj.trans_token.sort((a: TransferInterface, b: TransferInterface) => {
            // @ts-ignore
            return new Date(b.date) - new Date(a.date);
          }).map(
            // custom column in table with button
            (value: TransferInterface) => {
              value.button = true;
              value.balance = parseFloat(value.balance.toFixed(2));
              value.amount = parseFloat(value.amount.toFixed(2));
              return value;
            }
          );
        },
        failed(error): void {
          if (error.status === ErrorStatus.UNAUTHORIZED) {
            self.userService.logout(ErrorStatus.UNAUTHORIZED);
          }
        }
      });
  }

  private openDialog(transfer?: TransferInterface): void {
    let username = '';
    let amount = 0;
    if (transfer) {
      ({username = '', amount = 0} = transfer);
    }

    const configDialog = new MatDialogConfig();

    configDialog.width = '60vw';
    configDialog.height = '60vh';
    configDialog.maxWidth = '60vw';
    configDialog.maxHeight = '60vh';
    configDialog.minWidth = '60vw';
    configDialog.minHeight = '60vh';
    configDialog.panelClass = 'create-transfer-panel'
    configDialog.data = {
      name: (username) ? username : '',
      amount: isNaN(amount) ? 0 : Math.abs(amount)
    }


    const dialogRef = this.dialog.open(TransferCreateDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(result => {
      this.updateSource();
    });
  }
}
