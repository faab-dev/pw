import {RouterModule, Routes} from '@angular/router';
import {AppPathEnum} from './shared/enum/app-path.enum';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {LoginComponent} from './component/auth/login/login.component';
import {SignInComponent} from './component/auth/sign-in/sign-in.component';
import {TransfersComponent} from './component/protected/transfers/transfers.component';
import {ProtectedGuardService} from "./shared/service/protected.guard.service";
import {ErrorComponent} from "./component/error/error.component";


const routes: Routes = [
  {
    path: AppPathEnum.auth,
    children: [
      {
        path: '',
        children: [
          {path: AppPathEnum.login, component: LoginComponent},
          {path: AppPathEnum.sign_in, component: SignInComponent},
          {path: '', component: LoginComponent}
        ]
      }
    ],
  },
  {
    path: AppPathEnum.protected,
    canActivate: [ProtectedGuardService],
    children: [
      {
        path: '',
        children: [
          {path: AppPathEnum.transfers, component: TransfersComponent},
          {path: '', component: TransfersComponent}
        ]
      }
    ],
  },
  {
    path: AppPathEnum.error + '/:' + AppPathEnum.error_code,
    component: ErrorComponent
  },
  {path: '', redirectTo: AppPathEnum.auth, pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {enableTracing: false}
    )
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
