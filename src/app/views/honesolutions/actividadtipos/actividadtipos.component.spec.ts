import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadtiposComponent } from './actividadtipos.component';

describe('ActividadtiposComponent', () => {
  let component: ActividadtiposComponent;
  let fixture: ComponentFixture<ActividadtiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActividadtiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadtiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
