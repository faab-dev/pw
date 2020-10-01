import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {CookieExtraService} from './cookie-extra.service';
import {HttpHeaderEnum} from '../enum/http-header.enum';

@Injectable()
export class StorageService {

  constructor(
    private cookie: CookieExtraService
  ) {}

  private writeSession(name: string, value: string): void {
    name = environment.getPrefix() + this.cookie.DIVIDER + name;
    sessionStorage.setItem(name, value);
  }

  private readSession(name: string): string {
    name = environment.getPrefix() + this.cookie.DIVIDER + name;
    return sessionStorage.getItem(name);
  }

  private removeSession(name: string): void {
    name = environment.getPrefix() + this.cookie.DIVIDER + name;
    return sessionStorage.removeItem(name);
  }

  getAuthKey(): string {
    const str = this.cookie.get(HttpHeaderEnum.AUTHENTICATION);
    return (str) ? str : '';
  }

  setAuthKey(authorization: string): void {
    if (authorization === null) {
      this.cookie.delete(HttpHeaderEnum.AUTHENTICATION, '/', '');
      return;
    }
    this.cookie.set(HttpHeaderEnum.AUTHENTICATION, authorization, 0, '/');
  }

  logout(): void {
    this.clearLocalStorage();
    this.setAuthKey('');
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  writeCache(key: string, object: any): void {
    key = environment.getPrefix() + key;
    if (object === null || object === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, object);
  }

  readCache(key: string): string {
    key = environment.getPrefix() + key;
    return localStorage.getItem(key);
  }

}
