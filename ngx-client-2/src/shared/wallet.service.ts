import { Injectable } from '@angular/core';

import Neon, { wallet, api } from '@cityofzion/neon-js'

@Injectable()
export class WalletService {

    wallet: wallet.Account

    createAccount(password) {
        const privateKey = wallet.generatePrivateKey()
        const WIF = new wallet.Account(privateKey).WIF
        const nep2Key = wallet.encrypt(WIF, password)
        return nep2Key
    }
    decrypt(password: string) {

        //const decryptedKey = wallet.decrypt('6PYL8uayHWp8DduQtX9WppcbiAhCv3PqJQUDsPwe9d2TZqKSBjevr2dUcf', 'myPassword')
        const decryptedKey = wallet.decrypt(localStorage.getItem('nep2key'), password)
        return decryptedKey
    }
    getWallet(wif: string) {
        const w = new wallet.Account(wif)
        this.wallet = w
        return w
    }
    getBalance(address: string) {
         const filledBalance = api.neonDB.getBalance('MainNet','ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW')
        return filledBalance
    }
    
}
