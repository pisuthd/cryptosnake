import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


import  {DomService } from '../shared/dom.service'
import { ModalService } from '../shared/modal.service';
import { ModalTestComponent } from './modal-test/modal-test.component'
@NgModule({
  declarations: [
    AppComponent,
    ModalTestComponent
  
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DomService,
    ModalService

  ],
  entryComponents:[
    ModalTestComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
