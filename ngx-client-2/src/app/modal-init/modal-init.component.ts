import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service'


@Component({
  selector: 'app-modal-init',
  templateUrl: './modal-init.component.html',
  styleUrls: ['./modal-init.component.css']
})
export class ModalInitComponent implements OnInit {
  constructor(
    private modalService: ModalService
  ) { }
  ngOnInit() {
    
  }

  public close() {
    this.modalService.destroy();
  }

}
