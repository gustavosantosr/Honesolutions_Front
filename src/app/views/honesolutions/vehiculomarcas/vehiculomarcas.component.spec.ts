import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculomarcasComponent } from './vehiculomarcas.component';

describe('VehiculomarcasComponent', () => {
  let component: VehiculomarcasComponent;
  let fixture: ComponentFixture<VehiculomarcasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiculomarcasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculomarcasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
