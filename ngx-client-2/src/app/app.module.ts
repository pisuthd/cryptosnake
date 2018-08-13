import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


import { HttpModule } from '@angular/http';
import { OnlineService } from '../shared/online.service'
import  {DomService } from '../shared/dom.service'
import { ModalService } from '../shared/modal.service';
import { ModalTestComponent } from './modal-test/modal-test.component';
import { ModalInitComponent } from './modal-init/modal-init.component';
import { ModalSignUpComponent } from './modal-sign-up/modal-sign-up.component'
import { WalletService } from '../shared/wallet.service';
import { ModalLoginComponent } from './modal-login/modal-login.component'


@NgModule({
  declarations: [
    AppComponent,
    ModalTestComponent,
    ModalInitComponent,
    ModalSignUpComponent,
    ModalLoginComponent
  
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    DomService,
    ModalService,
    OnlineService,
    WalletService
    
  ],
  entryComponents:[
    ModalTestComponent,
    ModalInitComponent,
    ModalSignUpComponent,
    ModalLoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
