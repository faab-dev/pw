import {Injectable} from '@angular/core';
import {UserInfo} from '../interface/user-info.interface';
import {StorageService} from './storage.service';
import {Route, Router} from '@angular/router';
import {AppPathEnum} from '../enum/app-path.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: UserInfo = this.getDefaultUserInfo();

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  private getDefaultUserInfo(): UserInfo {
    return {
      user_info_token: {
        id: '',
        name: '',
        email: '',
        balance: 0
      }
    };
  }

  isUserAuth(): boolean {
    return !!(this.storage.getAuthKey());
  }

  getBalance(): number {
    return (
      this.userInfo
      && this.userInfo.user_info_token
      && isNaN(this.userInfo.user_info_token.balance)
    ) ? 0 : parseFloat(this.userInfo.user_info_token.balance.toFixed(2));
  }

  getUsername(): string {
    return (
      this.userInfo
      && this.userInfo.user_info_token
      && !this.userInfo.user_info_token.name
    ) ? '' : this.userInfo.user_info_token.name;
  }

  logout(errStatus?: number): void {
    this.storage.logout();
    this.userInfo = this.getDefaultUserInfo();
    const logoutPath: string[] = ['/'];
    if (errStatus) {
      logoutPath.push(AppPathEnum.error,  errStatus.toString(10));
    } else {
      logoutPath.push(AppPathEnum.auth);
    }
    this.router.navigate(logoutPath);
  }

  setUserInfo(userInfo: UserInfo): void {
    if (
      !userInfo
      || !userInfo.user_info_token
      || !userInfo.user_info_token.email
      || !userInfo.user_info_token.id
      || typeof userInfo.user_info_token.name !== 'string'
      || isNaN(userInfo.user_info_token.balance)
    ) {
      this.logout();
      return;
    }
    this.userInfo = userInfo;
  }
}
