import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrayectosComponent } from './trayectos.component';

describe('TrayectosComponent', () => {
  let component: TrayectosComponent;
  let fixture: ComponentFixture<TrayectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrayectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrayectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
