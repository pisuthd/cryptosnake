import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';


import { ModalService } from '../shared/modal.service'

import { ModalInitComponent } from './modal-init/modal-init.component'
import { ModalSignUpComponent } from './modal-sign-up/modal-sign-up.component'
import { ModalLoginComponent } from './modal-login/modal-login.component'

import { OnlineService } from '../shared/online.service'

import  {WalletService } from '../shared/wallet.service'

declare var CMain: any;
declare var jquery: any;
declare var createjs: any;
declare var setting: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  gameCallback


  constructor(
    private walletService : WalletService,
    private modalService: ModalService,
    private _ngZone: NgZone,
    private onlineService: OnlineService
  ) {
    window['angularComponentReference'] = {
      zone: this._ngZone,
      componentFn: (key,value) => this.callFunction(key,value),
      component: this,
    };
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    /*
    this.modalService.init(ModalInitComponent, {}, {});


    this.onlineService.getDefaultConfig().subscribe(
      result=>{
        let config  = result.cfg
        this.modalService.destroy()
        var oMain = new CMain(config);
      },
      err=>{
        alert(err)
      }
    )
    */
  
    var oMain = new CMain({
      hero_rotation_speed: 10, //HERO ROTATION SPEED WHEN MOVING RIGHT/LEFT
      hero_speed_up: 15, //SET THIS MAX HERO SPEED WHEN PRESS UP KEY
      hero_speed: 10, //MAX HERO SPEED
      snakes_AI_speed: [10, 10, 10, 10],
      food_score: [1], //ADD SCORE WHEN SNAKE EAT A FOOD BY TYPE  
      fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
      check_orientation: true //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
    });
   
    /*
     let inputs = {
       isMobile: false
     }
     
     this.modalService.init(ModalTestComponent, inputs, {});
 
     setTimeout(() => {
       var oMain = new CMain({
         hero_rotation_speed: 10, //HERO ROTATION SPEED WHEN MOVING RIGHT/LEFT
         hero_speed_up: 15, //SET THIS MAX HERO SPEED WHEN PRESS UP KEY
         hero_speed: 10, //MAX HERO SPEED
         snakes_AI_speed: [10, 10, 10, 10],
         food_score: [1], //ADD SCORE WHEN SNAKE EAT A FOOD BY TYPE  
         fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
         check_orientation: true //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
       });
     }, 3000)
     */

  }
  

  ngOnDestroy() {

  }

  removeModal() {
    this.modalService.destroy()
  }





  public callFunction(key: any,callback: any): any {
    //this.gameCallback = callback;

    if (key == 'create_account') {
      
      this.modalService.init(ModalSignUpComponent, {
        callback : callback
      }, {});
    } else if (key == 'login') {
      this.modalService.init(ModalLoginComponent, {
        callback : callback
      }, {});
    } else if (key == 'load_balance') {
      // use API
      //const balance = this.walletService.getBalance(this.walletService.wallet.address)
      //console.log(balance)
    }
    
    

   
  }
}


