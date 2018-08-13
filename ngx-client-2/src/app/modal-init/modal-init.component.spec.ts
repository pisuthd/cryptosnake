import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInitComponent } from './modal-init.component';

describe('ModalInitComponent', () => {
  let component: ModalInitComponent;
  let fixture: ComponentFixture<ModalInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
