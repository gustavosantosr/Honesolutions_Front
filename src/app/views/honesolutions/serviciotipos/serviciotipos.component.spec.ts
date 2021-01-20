import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciotiposComponent } from './serviciotipos.component';

describe('ServiciotiposComponent', () => {
  let component: ServiciotiposComponent;
  let fixture: ComponentFixture<ServiciotiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciotiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciotiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
