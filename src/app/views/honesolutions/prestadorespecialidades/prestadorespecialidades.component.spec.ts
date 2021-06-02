import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadorespecialidadesComponent } from './prestadorespecialidades.component';

describe('PrestadorespecialidadesComponent', () => {
  let component: PrestadorespecialidadesComponent;
  let fixture: ComponentFixture<PrestadorespecialidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestadorespecialidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestadorespecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
