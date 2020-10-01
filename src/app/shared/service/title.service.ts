import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private PREFIX: string = environment.app_title;
  private DIVIDER = ' - ';

  constructor(
    private title: Title
  ) {}

  setT(title: string, hidePrefix?: boolean): void {
    if (!title || typeof title !== 'string') {
      this.title.setTitle(this.PREFIX);
      return;
    }
    this.setPrefix(title, hidePrefix);
  }

  private setPrefix(title?: string, hidePrefix?: boolean): void {
    this.title.setTitle((hidePrefix === true) ? title : this.PREFIX + this.DIVIDER + title);
  }
}
