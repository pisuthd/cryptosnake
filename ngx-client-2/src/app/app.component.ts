import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from '@angular/core';


import { ModalService } from '../shared/modal.service'

import { ModalTestComponent } from './modal-test/modal-test.component'
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




  constructor(
    private modalService: ModalService,
    private _ngZone: NgZone
  ) {
    window['angularComponentReference'] = {
      zone: this._ngZone,
      componentFn: (value) => this.callExampleFunction(value),
      component: this,
    };
  }
  ngOnInit() {

  }
  ngAfterViewInit() {

    var oMain = new CMain({
      hero_rotation_speed: 10, //HERO ROTATION SPEED WHEN MOVING RIGHT/LEFT
      hero_speed_up: 15, //SET THIS MAX HERO SPEED WHEN PRESS UP KEY
      hero_speed: 10, //MAX HERO SPEED
      snakes_AI_speed: [10, 10, 10, 10],
      food_score: [1], //ADD SCORE WHEN SNAKE EAT A FOOD BY TYPE  
      fullscreen: true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
      check_orientation: true //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
    });
  }
  ngOnDestroy() {

  }





  public callExampleFunction(value: any): any {
    console.log('this works perfect', value);
    let inputs = {
      isMobile: false
    }
    this.modalService.init(ModalTestComponent, inputs, {});
  }
}


