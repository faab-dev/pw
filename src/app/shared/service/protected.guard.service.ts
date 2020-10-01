import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {UserService} from './user.service';
import {UserInfo} from '../interface/user-info.interface';
import {HttpService} from './http.service';

@Injectable()
export class ProtectedGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private http: HttpService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const self = this;
    return new Observable((observer: Subscriber<boolean>) => {
      self.http
        .get<UserInfo>('/api/protected/user-info',  {
          success(obj: UserInfo): void {
            self.userService.setUserInfo(obj);
            observer.next(true);
            // debugger;
          },
          failed(error): void {
            self.userService.logout(error.status);
            observer.next(false);
          }
        });
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }


}
