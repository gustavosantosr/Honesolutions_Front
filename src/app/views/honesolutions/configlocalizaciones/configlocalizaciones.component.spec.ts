import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiglocalizacionesComponent } from './configlocalizaciones.component';

describe('ConfiglocalizacionesComponent', () => {
  let component: ConfiglocalizacionesComponent;
  let fixture: ComponentFixture<ConfiglocalizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiglocalizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiglocalizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
