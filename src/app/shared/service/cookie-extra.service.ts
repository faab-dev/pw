import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class CookieExtraService extends CookieService {

  public readonly DIVIDER = '_';
  private PREFIX = 'SERIALIZE:';

  set(name: string, value: any, expires?: number | Date, path?: string, domain?: string, secure?: boolean): void {
    if (value === null) {
      value = '';
    } else {
      if (value instanceof Object) {
        value = this.PREFIX + JSON.stringify(value);
      }
    }


    if (!expires) {
      expires = 365 * 1;
      console.log('expires: ' + expires);
    }

    name = environment.getPrefix() + this.DIVIDER + name;
    super.set(name, value, expires, path, domain, secure);
  }


  getObj<T>(name: string): T | null{
    const str = this.get(name);
    if (str.search(this.PREFIX) === 0) {
      JSON.parse(str.substring(this.PREFIX.length));
      return JSON.parse(str.substring(this.PREFIX.length)) as T;
    }
    return null;
  }

  get(name: string): string {
    name = environment.getPrefix() + this.DIVIDER + name;
    return super.get(name);
  }

  remove(cookieName: string, path?: string): void {
    super.delete(cookieName, path);
  }


  delete(name: string, path?: string, domain?: string): void {
    // FIX for cookie service => https://github.com/7leads/ngx-cookie-service/issues/5
    const pathFix = (typeof path === 'string') ? 'path=' + path + ';' : '';
    const domainFix = (typeof pathFix === 'string') ? 'domain=' + domain + ';' : '';
    name = environment.getPrefix() + this.DIVIDER + name;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;' + pathFix + domainFix;
    super.delete(name, pathFix, domain);
  }

  deleteAllCookies(): void {
    const cookies = document.cookie.split(';');
    const cookieLength = cookies.length;
    for (let i = 0; i < cookieLength; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  getCookie(name: string): string {
    const cookieName: string = environment.getPrefix() + this.DIVIDER + name;
    const all: {
      [key: string]: string;
    } = super.getAll();
    return (all[cookieName]) ? all[cookieName] : '';
  }

  clear(name: string, paths: string[]): void {
    if (!name || !Array.isArray(paths)) {
      return;
    }
    const pathsLength = paths.length;
    for (let i = 0; i < pathsLength; i++) {
      const path = paths[i];
      if (typeof path !== 'string') {
        continue;
      }
      this.remove(name, path);
    }

  }
}
