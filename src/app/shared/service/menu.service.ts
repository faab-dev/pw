import {environment} from '../../../environments/environment';
import {EventEmitter, Injectable} from '@angular/core';
import {MenuItemInterface} from '../interface/menu-item.interface';
import {AppPathEnum} from '../enum/app-path.enum';
import {UserService} from './user.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  emitTransferCreate: EventEmitter<void> = new EventEmitter();

  authMenu: MenuItemInterface[] = [
    {
      title: 'Login',
      path: '/' + AppPathEnum.auth + '/' + AppPathEnum.login,
      show: () => {
        return (!this.userService.isUserAuth() && this.isPathSignIn());
      }
    },
    {
      title: 'SignIn',
      path: '/' + AppPathEnum.auth + '/' + AppPathEnum.sign_in,
      show: () => {
        return (!this.userService.isUserAuth() && !this.isPathSignIn());
      }
    },
    {
      title: 'Logout',
      click: (e: MouseEvent) => {
        debugger;
        this.userService.logout();
      },
      show: () => {
        return this.userService.isUserAuth();
      }
    }
  ];

  protectedMenu: MenuItemInterface = {
    title: 'Create transfer',
    click: () => {
      this.emitTransferCreate.emit();
    },
    show: () => {
      return (this.userService.isUserAuth());
    }
  };

  constructor(
      private userService: UserService,
      private router: Router
  ) {}

  getAuthMenu(): MenuItemInterface[] {
    return this.authMenu;
  }

  getProtectedMenu(): MenuItemInterface {
    return this.protectedMenu;
  }

  private isPathSignIn(): boolean {
    return this.router.url === '/' + AppPathEnum.auth + '/' + AppPathEnum.sign_in;
  }
}
