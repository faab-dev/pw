import {SeparatedBaseComponent} from '../../../shared/component/separated-base/sepatated-base.component';
import {Component} from '@angular/core';
import {UserInfo} from '../../../shared/interface/user-info.interface';
import {HttpService} from '../../../shared/service/http.service';
import {TransferInterface} from '../../../shared/interface/transfer.interface';
import {TransTokenInterface} from '../../../shared/interface/trans-token.interface';
import {MatDialog} from '@angular/material/dialog';
import {TransferCreateDialogComponent} from '../../../shared/component/transfer-create/transfer-create-dialog.component';
import {MenuService} from '../../../shared/service/menu.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['transfers.component.scss']
})
export class TransfersComponent extends SeparatedBaseComponent {

  transfers: TransferInterface[] = [];

  displayedColumns: string[] = ['date', 'username', 'amount', 'balance', 'button'];
  dataSource: TransferInterface[] = [];

  private emitCreateTransferSubscription: Subscription;

  constructor(
    private http: HttpService,
    private dialog: MatDialog,
    private menu: MenuService
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
          //
        }
      });
  }

  private openDialog(transfer?: TransferInterface): void {
    let username = '';
    let amount = 0;
    if (transfer) {
      ({username = '', amount = 0} = transfer);
    }

    const dialogRef = this.dialog.open(TransferCreateDialogComponent, {
      width: '250px',
      data: {
        name: (username) ? username : '',
        amount: isNaN(amount) ? 0 : Math.abs(amount)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateSource();
    });
  }
}
