import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificaciontiposComponent } from './identificaciontipos.component';

describe('IdentificaciontiposComponent', () => {
  let component: IdentificaciontiposComponent;
  let fixture: ComponentFixture<IdentificaciontiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificaciontiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificaciontiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
