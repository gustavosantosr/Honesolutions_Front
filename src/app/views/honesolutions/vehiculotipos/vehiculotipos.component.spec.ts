import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculotiposComponent } from './vehiculotipos.component';

describe('VehiculotiposComponent', () => {
  let component: VehiculotiposComponent;
  let fixture: ComponentFixture<VehiculotiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiculotiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculotiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
