import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOptionComponent } from './modal-option.component';

describe('ModalOptionComponent', () => {
  let component: ModalOptionComponent;
  let fixture: ComponentFixture<ModalOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
