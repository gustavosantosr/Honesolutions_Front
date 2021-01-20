import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadortiposComponent } from './prestadortipos.component';

describe('PrestadortiposComponent', () => {
  let component: PrestadortiposComponent;
  let fixture: ComponentFixture<PrestadortiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestadortiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestadortiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
