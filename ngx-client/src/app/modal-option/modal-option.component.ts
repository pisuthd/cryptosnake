import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service'

import { WalletService } from '../../shared/wallet.service'

@Component({
  selector: 'app-modal-option',
  templateUrl: './modal-option.component.html',
  styleUrls: ['./modal-option.component.css']
})
export class ModalOptionComponent implements OnInit {
  hasWallet: boolean = false
  key: string = ''
  constructor(
    private modalService: ModalService,
    private walletService: WalletService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('nep2key')) {
      this.hasWallet = true
    } else {
      this.hasWallet = false
    }


  }
  
  export() {
    if (!localStorage.getItem('nep2key')) {
      return
    }
    
    var csvData = localStorage.getItem('nep2key')
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'User_NEP2_key.txt';/* your file name*/
    a.click();
    return 'success';
  }
  signOff() {
    this.modalService.destroy();
    let self: any = this
    this.hasWallet = false
    self.callback(null)
  }
  importKey() {
    if (!this.key) {
      alert('Error: No Key to Import')
    }
    this.modalService.destroy();
    let self: any = this
    this.hasWallet = true
    self.callback(this.key)

  }
  public close() {
    this.modalService.destroy();
  }

}
