import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigprestadoresComponent } from './configprestadores.component';

describe('ConfigprestadoresComponent', () => {
  let component: ConfigprestadoresComponent;
  let fixture: ComponentFixture<ConfigprestadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigprestadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigprestadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
