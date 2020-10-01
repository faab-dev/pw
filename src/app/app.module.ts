import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {SignInComponent} from './component/auth/sign-in/sign-in.component';
import {LoginComponent} from './component/auth/login/login.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HttpService} from './shared/service/http.service';
import {StorageService} from './shared/service/storage.service';
import {TitleService} from './shared/service/title.service';
import {CookieExtraService} from './shared/service/cookie-extra.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NavHeaderComponent} from './shared/component/nav-header/nav-header.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CustomMatErrorComponent} from './shared/component/mat-error/custom-mat-error.component';
import {MongoIndexLimitDirective} from './shared/directive/error.directive';
import {TransfersComponent} from './component/protected/transfers/transfers.component';
import {ProtectedGuardService} from './shared/service/protected.guard.service';
import {TransferCreateDialogComponent} from './shared/component/transfer-create/transfer-create-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {ErrorComponent} from './component/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    SignInComponent,
    LoginComponent,
    CustomMatErrorComponent,
    MongoIndexLimitDirective,
    TransfersComponent,
    TransferCreateDialogComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule,

  ],
  providers: [
    HttpService,
    CookieExtraService,
    StorageService,
    ProtectedGuardService,
    TitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
