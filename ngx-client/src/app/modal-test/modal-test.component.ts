import { Component } from '@angular/core';

import { ModalService } from '../../shared/modal.service'

@Component({
  selector: 'app-modal-test',
  templateUrl: './modal-test.component.html',
  styleUrls: ['./modal-test.component.css']
})
export class ModalTestComponent  {

  constructor(
    private modalService : ModalService
  ) { }

  ngOnInit() {
    setTimeout(()=>{
      this.modalService.destroy();
    },5000)
  }

  public close() {
    this.modalService.destroy();
  }
}
