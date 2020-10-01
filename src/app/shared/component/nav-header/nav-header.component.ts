import {Component, ElementRef, Input} from '@angular/core';
import {SeparatedBaseComponent} from '../separated-base/sepatated-base.component';
import {MatSidenav} from '@angular/material/sidenav';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {MenuService} from '../../service/menu.service';
import {MenuItemInterface} from '../../interface/menu-item.interface';
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['nav-header.component.scss']
})
export class NavHeaderComponent extends SeparatedBaseComponent {
  @Input() sidenav: MatSidenav;
  @Input() title: string = environment.app_title;
  description = 'Money transfer between system users';

  authMenu: MenuItemInterface[] = [];
  protectedMenu: MenuItemInterface;

  /*public showMenuButton: boolean; */

 //  private breakpointSubscription: Subscription;
  constructor(
    // public breakpointObserver: BreakpointObserver
    private menuService: MenuService,
    private userService: UserService
  ) {
    super();
  }

  onInit(): void {
    super.onInit();
    this.authMenu = this.menuService.getAuthMenu();
    this.protectedMenu = this.menuService.getProtectedMenu();

    /*this.breakpointSubscription = this.breakpointObserver
      .observe(['(min-width: 400px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showMenuButton = true;
          return;
        }
        this.showMenuButton = false;
      });*/
  }

  getBalance(): number {
    return this.userService.getBalance();
  }

  getUsername(): string {
    return this.userService.getUsername();
  }

  onClickToggle(): void {
    if (
      !this.sidenav
      || !this.sidenav
      || typeof this.sidenav.toggle !== 'function'
    ) {
      return;
    }
    this.sidenav.toggle();
  }
}
