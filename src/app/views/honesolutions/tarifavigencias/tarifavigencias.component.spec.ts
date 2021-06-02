import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifavigenciasComponent } from './tarifavigencias.component';

describe('TarifavigenciasComponent', () => {
  let component: TarifavigenciasComponent;
  let fixture: ComponentFixture<TarifavigenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifavigenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifavigenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
