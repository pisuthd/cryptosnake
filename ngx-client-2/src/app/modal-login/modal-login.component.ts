import { Component, OnInit } from '@angular/core';


import { ModalService } from '../../shared/modal.service'

import { WalletService } from '../../shared/wallet.service'

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css']
})
export class ModalLoginComponent implements OnInit {
  password: string = ''
  constructor(
    private walletService: WalletService,
    private modalService: ModalService

  ) { }

  ngOnInit() {
  }
  errorMessage
  login() {
    this.errorMessage = null
    if (!this.password || this.password.length < 8) {
      alert('Password must have at least 8 characters')
      return
    }
    console.log(localStorage.getItem('nep2key'))
    try {
      const decryptedKey = this.walletService.decrypt(this.password);
      console.log('decryptedKey : ', decryptedKey)

      try {
        const wallet = this.walletService.getWallet(decryptedKey)
        this.modalService.destroy();
        let self: any = this
        self.callback(wallet)
      } catch (error) {
        this.errorMessage = 'Wallet Error on Testnet'
        console.error(error)

      }

    } catch (error) {
      console.error(error)
      this.errorMessage = 'Wrong Password'
    }



    //const decryptedKey = Neon.decrypt(nep2Key, this.password)
    //self.callback(nep2Key)
  }
  public close() {
    this.modalService.destroy();
  }

}
