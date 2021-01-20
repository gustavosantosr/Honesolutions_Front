import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespachoestadosComponent } from './despachoestados.component';

describe('DespachoestadosComponent', () => {
  let component: DespachoestadosComponent;
  let fixture: ComponentFixture<DespachoestadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespachoestadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespachoestadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
