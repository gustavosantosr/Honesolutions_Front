import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadorestarifasComponent } from './prestadorestarifas.component';

describe('PrestadorestarifasComponent', () => {
  let component: PrestadorestarifasComponent;
  let fixture: ComponentFixture<PrestadorestarifasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestadorestarifasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestadorestarifasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
