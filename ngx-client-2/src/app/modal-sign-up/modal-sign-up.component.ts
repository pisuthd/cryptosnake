import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service'

import  { WalletService } from '../../shared/wallet.service'
@Component({
  selector: 'app-modal-sign-up',
  templateUrl: './modal-sign-up.component.html',
  styleUrls: ['./modal-sign-up.component.css']
})
export class ModalSignUpComponent implements OnInit {

  password : string = ''
  onCreation = false
  constructor(
    private walletService : WalletService,
    private modalService: ModalService

  ) { }

  ngOnInit() {

  }
  createAccount() {
    if (!this.password || this.password.length < 8) {
      alert('Password must have at least 8 characters')
      return
    }
    this.onCreation = true

    let nep2Key = this.walletService.createAccount(this.password)
    this.onCreation = false
    this.modalService.destroy();
    let self:any = this
    
    self.callback(nep2Key)
  }
  
  public close() {
    this.modalService.destroy();
  }
}
