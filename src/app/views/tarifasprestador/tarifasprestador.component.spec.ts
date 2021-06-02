import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifasprestadorComponent } from './tarifasprestador.component';

describe('TarifasprestadorComponent', () => {
  let component: TarifasprestadorComponent;
  let fixture: ComponentFixture<TarifasprestadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarifasprestadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifasprestadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
