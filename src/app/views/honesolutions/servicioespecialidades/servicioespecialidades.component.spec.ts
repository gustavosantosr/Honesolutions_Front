import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioespecialidadesComponent } from './servicioespecialidades.component';

describe('ServicioespecialidadesComponent', () => {
  let component: ServicioespecialidadesComponent;
  let fixture: ComponentFixture<ServicioespecialidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioespecialidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioespecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
