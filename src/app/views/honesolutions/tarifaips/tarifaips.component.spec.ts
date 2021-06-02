import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaipsComponent } from './tarifaips.component';

describe('TarifaipsComponent', () => {
  let component: TarifaipsComponent;
  let fixture: ComponentFixture<TarifaipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifaipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifaipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
